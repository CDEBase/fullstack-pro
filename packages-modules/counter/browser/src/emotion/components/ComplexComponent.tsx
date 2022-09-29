import * as React from 'react';
import { css } from '@emotion/react';
import Navbar from './header';
import { Button } from './button';
import Form from './form';


const color = 'white';
const ComplexComponent = (props) => {
    const { styles, rules, theme } : any = props;

    const container = css({
        height: '100vh',
        backgroundColor: theme.color.primary,
        clipPath: 'polygon(0 0, 100% 0, 100% 76%, 0 97%)',
    });
    const heading = css({
        fontSize: '80px',
        lineHeight: '80px',
        color: 'white',
        fontWeight: '700',
        marginLeft: '16%',
    });
    const para = css({
        fontSize: '20px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginLeft: '16%',
    });
    const leftSection = css({
        width: '50%',
    });
    const rightSection = css({
        width: '50%',
    });
    const home = css({
        display: 'flex',
        marginTop: '100px',
        alignItems: 'center',
    });

    return (
        <div css={container}>
            <Navbar />
            <div css={home}>
                <div css={leftSection}>
                    <h1 css={heading}>Fly Makes You Faster</h1>
                    <p css={para}>
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
                <div css={rightSection}>
                    <Form bgColor={theme.color.primary} />
                </div>
            </div>
        </div>
    );
};

export const Complex = ComplexComponent;
