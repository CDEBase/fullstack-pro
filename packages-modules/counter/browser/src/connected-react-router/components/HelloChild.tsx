
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { State } from '../interfaces';
import { CONNECTED_REACT_ROUTER_ROUTES_TYPES } from '../constants';

interface HelloChildProps {
    pathname: string;
    search: string;
    hash: string;
}

const HelloChildComponent = ({ pathname, search, hash }: HelloChildProps) => (
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

const mapStateToProps = (state: State) => ({
    pathname: state.router.location.pathname,
    search: state.router.location.search,
    hash: state.router.location.hash,
});

export const HelloChild = connect(mapStateToProps)(HelloChildComponent);
