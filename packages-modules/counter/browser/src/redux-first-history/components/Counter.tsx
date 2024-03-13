/* eslint-disable react/button-has-type */
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { LOCATION_CHANGE } from '@cdmbase/redux-data-router';
import { increment, decrement } from '../redux';
import { State } from '../interfaces';

const CounterComponent: React.FC<StateProps & DispatchProps> = (props) => {
    const dispatch = useDispatch();

    return (
        <div>
    
            {`Counter: ${props.count}`}
            <button onClick={()=> dispatch({type: LOCATION_CHANGE, payload: {}})}>ROUTER</button>
            <button onClick={props.increment}>+</button>
            <button onClick={props.decrement}>-</button>
        </div>
    )
};

interface StateProps {
    count: number;
}

interface DispatchProps {
    increment: () => void;
    decrement: () => void;
}

const mapStateToProps = (state: State) => ({
    count: state.connectedReactRouterCounter,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
});

export default connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(CounterComponent);
