require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  path: "/socket/",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const axios = require("axios");
const { StaticAuthProvider } = require("twitch-auth");
const { ChatClient } = require("twitch-chat-client");
const port = 3001;
const clientId = process.env.CLIENT_ID || "";
const clientSecret = process.env.CLIENT_SECRET || "";
const redirectUri = process.env.REDIRECT_URI || "";
const currentScopes = ["chat:read", "chat:edit"];

app.use(cors());
app.use(express.static("build"));

app.get("/login", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "./build/") });
});

app.get("/chat", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "./build/") });
});

app.get("/client", (req, res) => {
  res.send({ client_id: clientId });
});

app.get("/auth", (req, res) => {
  res.redirect(
    `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=chat:read%20chat:edit`
  );
});

app.post("/tw-login/:code", (req, res) => {
  axios
    .post(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&code=${req.params.code}&grant_type=authorization_code&redirect_uri=${redirectUri}&scope=chat:read%20chat:edit`
    )
    .then((response) => {
      res.send(response.data);
    });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("handshake", async (accessToken) => {
    const authProvider = new StaticAuthProvider(
      clientId,
      accessToken,
      currentScopes
    );
    // const apiClient = new ApiClient({ authProvider });
    const chatClient = new ChatClient(authProvider, {
      channels: ["degradki"],
    });
    await chatClient.connect();
    socket.emit("twitch is connected", "twitch is connected");
    chatClient.onMessage((channel, user, message, msg) => {
      console.log("message");
      socket.emit("message", { channel, user, message, msg });
    });
  });
});

server.listen(port, () => console.log(`Running on port ${port}`));
