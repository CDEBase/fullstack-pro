import * as H from 'history';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';
import { Layout, Menu, Avatar } from 'antd';
import { IMenuPosition } from '@common-stack/client-react';

const { Sider } = Layout;
const { SubMenu } = Menu;

export function urlToList(url) {
    const urllist = url.split('/').filter(i => i);
    return urllist.map((urlItem, index) => {
        return `/${urllist.slice(0, index + 1).join('/')}`;
    });
}

const getImageUrl = (picture) => {
    return picture || "data:image/png;base64,${new Identicon(Base64.encode('myawsomestringbebe'), 420).toString()}";
};

/**
 * Recursively flatten  the data
 * [{path: string}, {path: string}] => {path, path2}
 * @param menu
 */
export const getFlatMenuKeys = menu =>
    menu.reduce((keys, item) => {
        keys.push(item.path);
        if (item.children) {
            return keys.concat(getFlatMenuKeys(item.children));
        }
        return keys;
    }, []);


/**
 * Find all matched menu keys based on paths
 * @param flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param paths: [/abc/ /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
    paths.reduce((matchKeys, path) => (
        matchKeys.concat(
            flatMenuKeys.filter(item => pathToRegexp(item).test(path)),
        )), []);

export namespace ISiderMenu {
    export interface CompProps {
        menuData: any;
        segments: any;
        onCollapse?: any;
        state?: boolean;
        isMobile?: boolean;
        // renderer?: any;
        Authorized?: any;
        collapsed?: boolean;
        logo?: any;
        user?: any;
        styles?: {
            grow?: any;
            logo?: any;
            sider?: any;
            icon?: any;
        };
    }

    export interface StateProps {
        location: H.Location;
    }

    export interface CompState {
        openKeys?: any;
    }

    export type Props = CompProps & StateProps;
    export type State = CompState;
}

export const SiderMenu = (props: ISiderMenu.Props) => {
    const [privateValues] = useState({
        menus: props.menuData,
        flatMenuKeys: getFlatMenuKeys(props.menuData)
    });

    // public static contextTypes = {
    //     renderer: PropTypes.any.isRequired,
    // };

    const defaultProps = ()=> {
        return {
            user: {},
            isMobile: false,
        };
    }

    useEffect(() => {
        setState({
            openKeys: getDefaultCollapsedSubMenus(props)
        })
    }, [props.location.pathname])

    /**
     * Convert pathname to openKeys
     * /list/search/articles => ['list', '/list/search']
     * @param props
     */
    const getDefaultCollapsedSubMenus = (props) => {
        const { location: { pathname } } = props;
        return getMenuMatchKeys(privateValues.flatMenuKeys, urlToList(pathname));
    }

    const [state, setState] = useState({
        openKeys: getDefaultCollapsedSubMenus(props)
    })

    /**
     * Allow menu.js config icon as string or ReactNode
     * icon: 'setting',
     * icon: 'http://demo.com/icon.png',
     * icon: <Icon type="setting" />,
     * @param icon
     */
    const getIcon = (icon) => {
        const { styles = {} } = props;
        if (typeof icon === 'string' && icon.indexOf('http') === 0) {
            return <img src={icon} alt="icon" className={styles.icon} />;
        } if (typeof icon === 'string') {
            return <div data-type={icon} style={styles.icon} />;
        }
        return icon;
    }

    const getAvatar = (menu) => {
        const { styles = {}, user } = props;
        return (
            <span data-user={user.nickname} id={!user || user.isTest ? `cde-user-placeholder` : 'cde-user'}>
                <div style={{ marginRight: '7px' }} data-src={getImageUrl(user.picture)}>
                    {user.nickname || 'Guest'}
                </div>
                {' '}
                <span> {user.nickname || 'Guest'}</span>
            </span>
        );
    }

    /**
     * Judge whether it is http link.return or a Link
     * @memberOf SiderMenu
     */
    const getMenuItemPath = item => {
        const { styles = {} } = props;
        const itemPath = conversionPath(item.path);
        const icon = getIcon(item.icon);
        const { target, name } = item;
        // Is it a http link
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {icon}
                    <span>{name}</span>
                </a>
            );
        }
        return (
            <Link
                to={itemPath}
                target={target}
                replace={itemPath === props.location.pathname}
                onClick={
                    props.isMobile
                        ? () => {
                            props.onCollapse(true);
                        }
                        : undefined
                }
            >
                {icon}
                <span>{name}</span>
            </Link>
        );
    }
    /**
     * get SubMenu or Item
     */
    const getSubMenuOrItem = item => {
        const { styles = {} } = props;
        if (item.children && item.children.some(child => child.name)) {
            const childrenItems = getNavMenuItems(item.children);
            if (childrenItems && childrenItems.length > 0) {
                return (
                    <SubMenu title={item.name} key={item.path}>
                        {childrenItems}
                    </SubMenu>
                );
            }
            return null;
        } else {
            return <Menu.Item key={item.path}>{getMenuItemPath(item)}</Menu.Item>;
        }
    }
    /**
     * @memberof SiderMenu
     */
    const getNavMenuItems = menusData => {
        if (!menusData) {
            return [];
        }
        return menusData.filter(item => item.name && !item.hideInMenu)
            .map(item => {
                // make dom
                const ItemDom = getSubMenuOrItem(item);
                return checkPermissionItem(item.authority, ItemDom);
            })
            .filter(item => item);
    }

    /**
     * Generates LOGO
     * @memberof SiderMenu
     */
    const getLogo = (logo) => {
        const { styles = {} } = props;
        return logo && (
            <div className={styles.logo} key="logo">
                <Link to="/">
                    <img src={logo.icon} alt="logo" />
                    <h1>{logo.name}</h1>
                </Link>
            </div>
        );
    }

    // Get the currently selected menu
    const getSelectedMenuKeys = () => {
        const { location: { pathname } } = props;
        return getMenuMatchKeys(privateValues.flatMenuKeys, urlToList(pathname));
    }
    // conversion Path
    const conversionPath = path => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    }
    // permission to check
    const checkPermissionItem = (authority, ItemDom) => {
        if (props.Authorized && props.Authorized.check) {
            const { check } = props.Authorized;
            return check(authority, ItemDom);
        }
        return ItemDom;
    }
    const isMainMenu = key => {
        return privateValues.menus.some(item => key && (item.key === key || item.path === key));
    }
    const handleOpenChange = openKeys => {
        const lastOpenKey = openKeys[openKeys.length - 1];
        const moreThanOne = openKeys.filter(openKey => isMainMenu(openKey)).length > 1;
        setState({
            openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
        });
    }

    // const { renderer } = this.context;
    const { logo, collapsed, segments = [], onCollapse, styles = {} } = props;
    const { openKeys } = state;
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : { openKeys };
    // If pathname can't match, use the nearest parent's key
    let selectedKeys = getSelectedMenuKeys();
    if (!selectedKeys.length) {
        selectedKeys = [openKeys[openKeys.length - 1]];
    }

    return (
        <Sider
            trigger={null}
            collapsible={true}
            collapsed={collapsed}
            breakpoint="lg"
            onCollapse={onCollapse}
            width={256}
            className={styles.sider}
        >
            {getLogo((privateValues.menus.filter(menu => menu.position === IMenuPosition.LOGO) || [])[0])}
            <div className={styles.grow}>
                <Menu
                    key="Menu-Middle"
                    theme="dark"
                    mode="inline"
                    {...menuProps}
                    className={styles.grow}
                    onOpenChange={handleOpenChange}
                    selectedKeys={selectedKeys}
                    style={{ padding: '16px 0', width: '100%' }}
                >
                    {getNavMenuItems(privateValues.menus.filter(menu => menu.position === IMenuPosition.MIDDLE))}
                </Menu>
                {segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex}>
                        {React.cloneElement(segment, { collapsed })}
                    </div>
                ))}
            </div>
            <Menu
                key="Menu-Bottom"
                theme="dark"
                mode="inline"
                {...menuProps}
                onOpenChange={handleOpenChange}
                selectedKeys={selectedKeys}
                style={{ padding: '16px 0', width: '100%' }}
            >
                {getNavMenuItems(privateValues.menus.filter(menu => menu.position === IMenuPosition.BOTTOM))}
            </Menu>
        </Sider>
    )
}