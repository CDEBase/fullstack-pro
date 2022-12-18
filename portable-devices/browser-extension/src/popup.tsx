
import * as React from 'react';
import Main from './app/Popup';
import { createRoot } from 'react-dom/client';
import './config/public-config';
import 'reflect-metadata';
import 'antd/dist/antd.css';



const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<React.StrictMode>
    <Main />
</React.StrictMode>);

