
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
        Hello-Child 23423
        <ul>
            {/* <Link>has problem to load. we may not able to use react-router components outside of forntend-server</Link> */}
            <li><a href={`${CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO}?color=Blue&size=40`}>with query string</a></li>
            <li><a href={`${CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO}#lovelove`}>with hash</a></li>
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
    pathname: state.router?.location.pathname,
    search: state.router?.location.search,
    hash: state.router?.location.hash,
});

export const HelloChild = connect(mapStateToProps)(HelloChildComponent);
