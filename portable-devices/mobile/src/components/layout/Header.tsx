/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { Header } from 'react-native-elements';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const MainHeader = (props: any) => {
    const navigation = useNavigation();
    return (
        <Header
            placement="left"
            leftComponent={{
                icon: 'menu',
                color: '#fff',
                onPress: () => navigation.dispatch(DrawerActions.toggleDrawer()),
            }}
            centerComponent={{
                text: props.title,
                style: { color: '#fff' },
            }}
        />
    );
};

export default MainHeader;
