import React from 'react';
import { Box, Text } from 'native-base';
import { useRoute } from '@react-navigation/native';

export const PersonalInfo = () => {
    const route = useRoute();
    return (
        <Box>
            <Text>Personal Info</Text>
        </Box>
    );
};
