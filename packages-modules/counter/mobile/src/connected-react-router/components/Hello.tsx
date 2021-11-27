/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import {  Box } from 'native-base';
import { connect } from 'react-redux';

interface Style {
    container: ViewStyle;
}

const HelloScreen = () => {
    return (
        <View style={styles.container}>
            <Box>
                <Text>Hello Value</Text>
            </Box>
            <Box style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                <View>
                    <Text>Footer will be here</Text>
                </View>
            </Box>
        </View>
    );
};

const styles = StyleSheet.create<Style>({
    container: {
        flex: 1,
        textAlign: 'center',
    },
});

export const Hello = connect((state: any) => {
    return {
        settings: state.settings,
        location: state?.route?.location,
    };
})(HelloScreen);
