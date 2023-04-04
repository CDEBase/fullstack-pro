import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

export const Dashboard = () => {
  const { orgName } = useParams<{ orgName: string }>();
  const user = useSelector((state: any) => state?.user)
  return <div>
    <h5>Welcome to the Dashboard. User {user?.profile?.nickname} has been logged In !</h5>
    <h6>Selected org is {orgName}!</h6>
  </div>
}