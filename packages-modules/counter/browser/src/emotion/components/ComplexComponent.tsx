import * as React from 'react';
import { css } from '@emotion/react';
import Navbar from './header';
import { Button } from './button';
import Form from './form';
import { styleSheet } from './styles';


const color = 'white';
const ComplexComponent = (props) => {
    const { styles, rules, theme } : any = props;

    return (
        <div css={styleSheet.container} >
            <Navbar />
            <div css={styleSheet.home}>
                <div css={styleSheet.leftSection}>
                    <h1 css={styleSheet.heading}>Fly Makes You Faster</h1>
                    <p css={styleSheet.para}>
                        New free template by uicookies.com. For more templates visit the site. Lorem ipsum dolor sit
                        amet, consectetur adipisicing elit.
                    </p>
                    <Button
                        bgColor="#00CA4C"
                        color="#fff"
                        padding="8px 40px"
                        borderRadius="50px"
                        border="1px solid #00CA4C"
                        marginLeft="16%"
                        colorOnHover={theme.color.primary}
                    >
                        Get Started
                    </Button>
                </div>
                <div css={styleSheet.rightSection}>
                    <Form bgColor={theme.color.primary} />
                </div>
            </div>
        </div>
    );
};

export const Complex = ComplexComponent;
