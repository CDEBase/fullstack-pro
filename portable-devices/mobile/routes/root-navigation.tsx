import React from 'react';

export const navigationRef = React.createRef<any>();

export function navigate(name: any) {
  navigationRef.current?.navigate(name);
}