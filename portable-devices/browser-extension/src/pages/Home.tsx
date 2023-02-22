import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { ExtensionRoutes } from '../enums';

export const Home = () => {
  const user = useSelector((state: any) => state?.user)
  if (user?.auth0UserId) {
    return <Redirect to={ExtensionRoutes.Dashboard} />
  }
  return <Redirect to={'/login'} />
}