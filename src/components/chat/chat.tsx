import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import styles from "./chat.scss";

export function Chat() {
  return (
    <div>
      <Grid container component="main" className={styles.auth}>
        <Grid item xs={false} sm={4} md={7} className={styles.image} />
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
          <Grid container spacing={0} justify="center" direction="row">
            <Grid item>
              <Grid
                container
                direction="column"
                justify="center"
                spacing={2}
                className={styles.loginForm}
              >
                <Paper
                  variant="elevation"
                  elevation={2}
                  className={styles.loginBackground}
                ></Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
export default Chat;
