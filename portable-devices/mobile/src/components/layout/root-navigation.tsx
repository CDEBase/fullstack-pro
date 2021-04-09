/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */


import React, { useRef } from 'react';

export const navigationRefs = React.createRef<any>();

export function navigate(name: any) {
    navigationRefs.current?.navigate(name);
}
