import React, {useState} from "react"
import {Container, View, Text, List, ListItem, Left, Right, Icon} from "native-base"
import {Link} from "react-router-dom"
import {DrawerActions} from "@react-navigation/native"

const SideBar = (props: any) => {
    const [icon, setIcon] = useState('arrow-forward')
    const[toggle, setToggle] = useState(false)
    const expand = () => {
        if(icon === 'arrow-forward'){
            setIcon('arrow-down')
            setToggle(true)
        } else{
            setIcon('arrow-forward')
            setToggle(false)
        }
    }
    return(
        <Container style={{width: '30%'}}>
            <List>
                {props.routes.map((route: any) => (
                    <Link key={route.key} to={route.path} style={{textDecoration: 'none'}}>
                        <ListItem>
                            <Left>
                                <Text>{route.name}</Text>
                            </Left>
                            <Right>
                                <Icon name={icon}/>
                            </Right>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Container>
    )
}

export default SideBar