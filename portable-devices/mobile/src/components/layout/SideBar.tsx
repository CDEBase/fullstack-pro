/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState } from 'react';
import { Container, View, Text, List, ListItem, Left, Right, Icon, Drawer } from 'native-base';
import { Link } from 'react-router-dom';
import { DrawerActions } from '@react-navigation/native';

const SideBar = ({ descriptors, routes, navigation }: any) => {
    console.log('---ROUTES IN SIDEBAR', routes, descriptors);
    const [icon, setIcon] = useState('arrow-forward');
    const [toggle, setToggle] = useState(false);
    const expand = () => {
        if (icon === 'arrow-forward') {
            setIcon('arrow-down');
            // setToggle(true);
        } else {
            setIcon('arrow-forward');
            setToggle(false);
        }
    };
    return (
        <Container>
            {routes[1].routes.map((route: any) => (
                <List key={route.key}>
                    <Link key={route.key} to={route.path}>
                        <ListItem key={route.key}>
                            <Left>
                                <Text>{route.name}</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                    </Link>
                </List>
            ))}
        </Container>
    );
};

export default SideBar;
