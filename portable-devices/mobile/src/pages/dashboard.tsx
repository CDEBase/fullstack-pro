import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
interface Style {
    container: ViewStyle;
}

const Dashboard = () => {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.container}>
            <Text>Dashboard Value</Text>
            <Text>Calendar</Text>
            <Button onPress={() => navigation.navigate('MainStack.Setting')}>Setting</Button>
        </View>
    );
};

const styles = StyleSheet.create<Style>({
    container: {
        textAlign: 'center',
    },
});

export default Dashboard;
