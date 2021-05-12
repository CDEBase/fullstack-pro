import React, { useState } from 'react';
import { Container, View, Text, List, ListItem, Left, Right, Icon, Drawer } from 'native-base';
import { Link } from 'react-router-native';

const SideBar = ({ routes, matchUrl }: any) => {
    const [icon, setIcon] = useState('chevron-down-outline');
    const [isToggle, setToggle] = useState(false);

    const toggle = () => {
        if (isToggle) {
            setIcon('chevron-down-outline');
            setToggle(false);
        } else {
            setIcon('chevron-up-outline');
            setToggle(true)
        }
    }

    const isMenuExist = routes.length > 0;

    return (
        <Container style={{ backgroundColor: '#1f1f1f' }}>
            {isMenuExist && routes.map(menu => (
                menu.routes ? (
                    <List>
                        <ListItem onPress={() => toggle()}>
                            <Left>
                                <Icon style={{ color: isToggle ? '#fff' : '#a1a1a1' }} name="document-outline" />
                                <Text style={{ color: isToggle ? '#fff' : '#a1a1a1' }}>{menu.name}</Text>
                            </Left>
                            <Right>
                                <Icon name={icon} />
                            </Right>
                        </ListItem>
                        {isToggle && (menu.routes.map(subMenu => (
                            <List>
                                <ListItem>
                                    <Left>
                                        <Link to={subMenu.path} underlayColor="#f0f4f7">
                                            <Text style={{ color: '#a1a1a1' }}>{subMenu.name}</Text>
                                        </Link>
                                    </Left >
                                </ListItem >
                            </List >
                        )))}
                    </List>
                ) :
                    (<List>
                        <ListItem>
                            <Left>
                                <Link to={menu.path} underlayColor="#f0f4f7">
                                    <Text style={{ color: '#a1a1a1' }}>{menu.name}</Text>
                                </Link>
                            </Left >
                        </ListItem >
                    </List >)
            ))}
        </Container >
    )
}

export default SideBar;
