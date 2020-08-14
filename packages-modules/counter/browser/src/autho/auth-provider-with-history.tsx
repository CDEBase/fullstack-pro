import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  // const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  // const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
 
  const history = useHistory();

  const onRedirectCallback = (appState) => {
    // history.push(appState?.returnTo || window.location.pathname);
    history.push("/login-complete");
  };


  return (
    <Auth0Provider
    domain="dev-gas1k154.us.auth0.com"
    clientId="73kPE0D6jsn34eJlyPRhcWhXAUGP7Wd0"
    redirectUri={"http://localhost:3000/login-complete"}
    audience="https://dev-gas1k154.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
    onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;