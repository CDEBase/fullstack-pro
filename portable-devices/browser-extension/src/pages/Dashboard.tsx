import React from 'react';
import { useSelector } from 'react-redux';

export const Dashboard = () => {
  const user = useSelector((state: any) => state?.user)

  return <div>
    Welcome to the Dashboard. User has been logged In!
    ID = {user?.auth0UserId}
  </div>
}