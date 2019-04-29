import * as React from 'react';
import { HelloChild } from './HelloChild';

const Hello = () => (
    <div>
        <div>Hello</div>
        <HelloChild />
    </div>
);

export { Hello };
