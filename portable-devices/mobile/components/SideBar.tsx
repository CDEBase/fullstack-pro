import React from "react"
import {Container, Text, List, ListItem, Left, Right, Icon} from "native-base"
import {TouchableOpacity} from 'react-native'
import {DrawerActions} from "@react-navigation/native"

const SideBar = ({descriptors, state, navigation}: any) => {
    let selectedRoute = state.history[state.index].key
    console.log("+++SELECTED+++", selectedRoute)
    return(
        <Container>
            {state.routes.map((route: any) => (
                <List key={route.key}>
                    <ListItem
                    selected={route.key === selectedRoute} 
                    onPress={() => {
                        const event = navigation.emit({
                        type: 'itemPress',
                        target: route.key,
                        canPreventDefault: true,
                        });
        
                        if (!event.defaultPrevented) {
                        navigation.dispatch({
                            ...DrawerActions.jumpTo(route.name),
                            target: state.key,
                        });
                        }
                    }}
                    >
                        <Left>
                            <Text>{descriptors[route.key].options.title}</Text>
                        </Left>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </ListItem>
                </List>
            ))}
        </Container>
    )
}

export default SideBar