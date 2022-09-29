import { css } from '@emotion/react';
import { Button } from './button';

const Navbar = () => {
    const navItems = [
        {
            title: 'Home',
        },
        {
            title: 'Features',
        },
        {
            title: 'Reviews',
        },
        {
            title: 'Pricing',
        },
        {
            title: 'FAQ',
        },
    ];
    const color = 'white';
    const header = css({
        display: 'flex',
        padding: '20px',
        justifyContent: 'space-around',
        alignItems: 'baseline',
    });
    const itemList = css({
        listStyleType: 'none',
        display: 'flex',
    });
    const li = css({
        fontSize: '18px',
        color: color,
        cursor: 'pointer',
        marginRight: '50px',
    });
    const logo = css({
        fontSize: '30px',
        color: color,
        cursor: 'pointer',
    });
    return (
        <div css={header}>
            <div css={logo}>CDNBase LLC</div>
            <div>
                <div>
                    <ul css={itemList}>
                        {navItems.map((item, index) => {
                            return (
                                <li css={li} key={index}>
                                    {item.title}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            <Button bgColor="transparent" color="#fff" padding="8px 30px" borderRadius="4px" border="1px solid white">
                Get Started
            </Button>
        </div>
    );
};

export default Navbar;
