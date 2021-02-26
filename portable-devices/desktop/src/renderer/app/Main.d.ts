import * as React from 'react';
import { ServerError } from './Error';
export interface MainState {
    error?: ServerError;
    info?: any;
}
export declare class Main extends React.Component<any, MainState> {
    constructor(props: any);
    componentDidCatch(error: ServerError, info: any): void;
    render(): JSX.Element;
}
declare const _default: typeof Main;
export default _default;
