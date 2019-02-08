
import * as React from 'react';
import * as PropTypes from 'prop-types';

import { Menu } from 'antd';

class MenuItem extends React.Component {
    public static propTypes = {
        children: PropTypes.node,
    };

    public render() {
        const { children, ...props } = this.props;
        return <Menu.Item {...props}>{children}</Menu.Item>;
    }
}

export default MenuItem;
