import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button  } from 'antd';

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <Button
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        }) 
      }
      type="danger" htmlType="submit"
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;