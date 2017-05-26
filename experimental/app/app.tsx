import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container } from 'reactstrap';

import NavBar from './nav_bar';

const footerHeight = '40px';

const Footer = styled.footer`
    position: 'absolute',
    button: 0,
    width: 100%,
    lineHeight: ${footerHeight},
    height: ${footerHeight}
`;

export default function App({ children }) {
    return (
        <div>
            <NavBar />
            <Container id="content">
                {children}
            </Container>
            <Footer>
                <div className="text-center">
                    &copy; 2017. CDMBase LLC.
                    </div>
            </Footer>
        </div>
    )
}

