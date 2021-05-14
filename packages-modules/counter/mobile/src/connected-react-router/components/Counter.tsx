import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { increment, decrement } from '../redux';
import { State } from '../interfaces';

interface CounterStateProps {
    count: number;
}

interface CounterDispatchProps {
    increment: () => void;
    decrement: () => void;
}

const CounterScreen: React.SFC<CounterStateProps & CounterDispatchProps> = (props) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ marginTop: 20 }}>
                <View style={{ marginBottom: 20 }}>
                    <Text>Counter value: {props.count}</Text>
                </View>

                <Button onPress={props.increment} title="Increment Counter" />

                <View style={{ marginTop: 10 }}>
                    <Button onPress={props.decrement} title="Decrement Counter" />
                </View>
            </View>
        </View>
    );
};

const mapStateToProps = (state: State) => ({
    count: state.connectedReactRouter_counter,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
});

export const Counter = connect<CounterStateProps, CounterDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(CounterScreen);
