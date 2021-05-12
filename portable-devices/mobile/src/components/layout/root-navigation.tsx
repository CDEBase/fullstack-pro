import React, { useRef } from 'react';

export const navigationRefs = React.createRef<any>();

export function navigate(name: any) {
    navigationRefs.current?.navigate(name);
}
