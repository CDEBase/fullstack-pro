
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Options from './app/Options';


import './config/public-config';
import 'reflect-metadata';
import './index.css';



const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<React.StrictMode>
    <Options />
</React.StrictMode>);

