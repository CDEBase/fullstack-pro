/* eslint-disable react/button-has-type */
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { increment, decrement } from '../redux';
import { State } from '../interfaces';

const CounterComponent: React.SFC<StateProps & DispatchProps> = (props) => (
    <div>
        Counter: {props.count}
        <button onClick={props.increment}>+</button>
        <button onClick={props.decrement}>-</button>
    </div>
);

interface StateProps {
    count: number;
}

interface DispatchProps {
    increment: () => void;
    decrement: () => void;
}

const mapStateToProps = (state: State) => ({
    count: state.connectedReactRouter_counter,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
});

export const Counter = connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(CounterComponent);
