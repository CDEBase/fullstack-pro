import 'reflect-metadata';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// load environment config
import './config/public-config';
import Options from './app/Options';

// Virtual (module as any), generated in-memory by zenjs, contains count of backend rebuilds
// tslint:disable-next-line
import 'antd/dist/antd.css';
// import 'react-table/react-table.css';

const rootEl = document.getElementById('root');
let frontendReloadCount = 0;

const renderApp = ({ key }: { key: number }) => ReactDOM.render(<Options key={key} />, rootEl);
renderApp({ key: frontendReloadCount });
