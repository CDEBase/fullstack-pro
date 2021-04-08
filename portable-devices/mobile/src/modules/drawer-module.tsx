import React, {useState} from 'react';
import { History } from 'history';
import { Drawer, Content } from 'native-base';
import SideBar from "../components/SideBar"
import MainHeader from "./header"
import * as RootNavigation from "../routes/root-navigation"
import { useEffect } from 'react';

export const DrawerModule = (props: { history: History<any>, location: any, routes: any }) => {

    const [component, setComponent] = useState<any>({})
    useEffect(() => {
        const found = props.routes.find((route: any) => route.path === props.location.pathname)
        if(found){
            setComponent(found)
        }
    }, [props.location])

    const drawerRef = React.useRef<any>()
    const closeDrawer = () => {
        drawerRef.current?._root.close()
    };
    const openDrawer = () => {
        drawerRef.current?._root.open()
    }

    return (
        <Drawer 
        ref={drawerRef} 
        tapToClose={true}
        content={<SideBar {...props} />}
        onClose={() => closeDrawer()}
        onOpen={() => openDrawer()} >
            <MainHeader drawerRef={drawerRef} title={""} navigation={RootNavigation}/>
            <Content>
               {/* render component here */}
            </Content>
        </Drawer>
    )
}