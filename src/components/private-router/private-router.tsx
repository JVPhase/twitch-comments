import React, { FC } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../context/auth";

interface Props {
  component: any;
  path: any;
}

const PrivateRoute: FC<Props> = ({ component: Component, ...rest }) => {
  const { accessToken } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        accessToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { referer: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
