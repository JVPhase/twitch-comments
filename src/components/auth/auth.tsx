import React, { FC, useState } from "react";
import {
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import styles from "./auth.module.scss";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useChannel } from "../../context/channel";
import axios from "axios";
import { host } from "../../consts";

interface AuthProps {
  location: any;
}

export const Auth: FC<AuthProps> = (props) => {
  const [code, setCode] = useState("");
  const { setAccessToken, accessToken } = useAuth();
  const { setChannel, channel } = useChannel();

  if (!code && new URLSearchParams(window.location.search).get("code")) {
    setCode(new URLSearchParams(window.location.search).get("code") as string);
  }
  console.log("code", code);

  const twLogin = () => {
    axios.post(`${host}/tw-login/${code}`).then((res) => {
      setAccessToken(res.data.access_token);
    });
  };

  if (accessToken) {
    return <Redirect to={"/chat"} />;
  }

  return (
    <div>
      <Grid container component="main" className={styles.auth}>
        <Grid item xs={false} sm={4} md={7} className={"bg-image"} />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          className={styles.rightBack}
        >
          <Typography
            variant="h4"
            color="primary"
            align="center"
            className={styles.name}
          >
            Twitch Comments
          </Typography>
          <Grid container spacing={0} justifyContent="center" direction="row">
            <Grid item>
              <Grid
                container
                direction="column"
                justifyContent="center"
                spacing={2}
                className={styles.loginForm}
              >
                <Paper
                  variant="elevation"
                  elevation={2}
                  className={styles.loginBackground}
                >
                  {code ? (
                    <Grid item>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <TextField
                            type="text"
                            label="Channel id"
                            fullWidth
                            name="channel"
                            variant="outlined"
                            value={channel}
                            required
                            autoFocus
                            onChange={(e) => {
                              setChannel(e.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            className={styles.buttonBlock}
                            onClick={() => twLogin()}
                          >
                            Enter chat
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Link href={`${host}/auth`}>Login with Twitch</Link>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default Auth;
