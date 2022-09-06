import React from 'react';
import { Box, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const HelloScreen = () => {
    const navigation = useNavigation<any>();
    return (
        <Box>
            <Text>Hello Value</Text>
            <Button onPress={() => navigation.navigate('MainStack.Guest.About.PersonalInfo')}>Personal Info</Button>
        </Box>
    );
};

const Hello = connect((state: any) => {
    return {
        settings: state.settings,
        location: state?.route?.location,
    };
})(HelloScreen);

export default Hello;
