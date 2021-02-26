import * as React from 'react';
import { logger } from '@cdm-logger/client';
import { Redirect, BrowserRouter } from "react-router-dom";
import { message } from 'antd';
import { Error500 } from './500';
import { ServerError } from './ServerError';
import { createBrowserHistory } from 'history';

type IErrorBoundryState = { error: any, type: string }


export class ErrorBoundary extends React.Component<any, IErrorBoundryState> {
    constructor(props) {
        super(props);
        const serverError: any = window.__SERVER_ERROR__;
        if (serverError) {
            this.state = { error: new ServerError(serverError), type: 'serverError' };
        } else {
            this.state = { error: undefined, type: undefined };
        }
    }

    componentDidCatch(error) {
        let type = undefined;

        if (process.env.NODE_ENV === 'production') {
            type = '404'
        } else {
            type = '500'
        }
        // Update state so the next render will show the fallback UI.
        this.setState({ error, type });
    }


    render() {
        const { error, type } = this.state;
        if (error) {
            return <Error500 error={error} />
        }
        return this.props.children;
    }
}