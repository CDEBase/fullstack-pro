import * as React from 'react';
declare type IErrorBoundryState = {
    error: any;
    type: string;
};
export declare class ErrorBoundary extends React.Component<any, IErrorBoundryState> {
    constructor(props: any);
    componentDidCatch(error: any): void;
    render(): {};
}
export {};
