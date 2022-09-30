import { css } from '@emotion/react';
import { Button } from './button';
import { styleSheet } from './styles';

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
    return (
        <div css={styleSheet.header}>
            <div css={styleSheet.logo}>CDNBase LLC</div>
            <div>
                <div>
                    <ul css={styleSheet.itemList}>
                        {navItems.map((item, index) => {
                            return (
                                <li css={styleSheet.li} key={index}>
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
