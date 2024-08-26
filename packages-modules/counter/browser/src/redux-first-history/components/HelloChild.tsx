
import * as React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CONNECTED_REACT_ROUTER_ROUTES_TYPES } from '../constants';

export const HelloChild = () => {
    const { pathname, search, hash } = useLocation();
    
    return (
        <div>
            Hello-Child
            <ul>
                <li><Link to={`${CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO}?color=Blue&size=40`}>with query string</Link></li>
                <li><Link to={`${CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO}#lovelove`}>with hash</Link></li>
            </ul>
            <div>
                pathname: {pathname}
            </div>
            <div>
                search: {search}
            </div>
            <div>
                hash: {hash}
            </div>
        </div>
    );
}
