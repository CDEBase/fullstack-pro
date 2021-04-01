import React from 'react'
import {Header} from "react-native-elements"
import {useNavigation} from "@react-navigation/native";

const MainHeader = (props: any) => {
    const navigation = useNavigation<any>();
    return (
        <Header placement='left' leftComponent={{icon: 'menu', color: '#fff', onPress: () => navigation.toggleDrawer()}}
      centerComponent={{text: props.title, style:{color: "#fff"}}}/>
    )
}

export default MainHeader