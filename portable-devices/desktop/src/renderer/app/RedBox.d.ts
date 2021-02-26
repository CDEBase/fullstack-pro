import * as React from 'react';
import { ServerError } from './Error';
export interface RedBoxState {
    mapped?: boolean;
}
export interface RedBoxProps {
    error: ServerError;
}
export default class RedBox extends React.Component<RedBoxProps, RedBoxState> {
    constructor(props: RedBoxProps);
    componentDidMount(): void;
    renderFrames(frames: any[]): JSX.Element[];
    render(): JSX.Element;
}
