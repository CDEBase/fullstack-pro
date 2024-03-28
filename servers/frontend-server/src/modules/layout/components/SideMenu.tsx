import React from 'react';
import { Link } from '@remix-run/react';
import { Layout } from 'antd';
const { Sider } = Layout;

export const SiderMenu: React.FC = (props) => {
  const getItems = (menus) => {
    return menus.map((menu, k) => {
      if (menu.children && menu.children.length > 0) {
        return <li key={k} style={{padding: '10px 0'}}>
          <Link to={menu.path}>{menu.name}</Link>
          <ul style={{listStyle: 'none'}}>{getItems(menu.children)}</ul>
        </li>
      } else {
        return <li key={k} style={{padding: '10px 0'}}>
          <Link to={menu.path}>{menu.name}</Link>
        </li>
      }
    });
  }

  return (
    <Sider
      trigger={null}
      collapsible={false}
      breakpoint="lg"
      width={256}
    >
      <ul style={{listStyle: 'none'}}>
        {getItems(props.menuData)}
      </ul>
    </Sider>
  );
};
