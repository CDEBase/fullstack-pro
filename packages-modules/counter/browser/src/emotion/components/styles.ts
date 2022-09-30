import { css } from '@emotion/react';
import { theme } from '../theme';

const color = 'white';
export const styleSheet = {
    header: css({
        display: 'flex',
        padding: '20px',
        justifyContent: 'space-around',
        alignItems: 'baseline',
    }),
    itemList: css({
        listStyleType: 'none',
        display: 'flex',
    }),
    li: css({
        fontSize: '18px',
        color: color,
        cursor: 'pointer',
        marginRight: '50px',
    }),
    logo: css({
        fontSize: '30px',
        color: color,
        cursor: 'pointer',
    }),
    container: css({
        height: '100vh',
        backgroundColor: theme.color.primary,   
        clipPath: 'polygon(0 0, 100% 0, 100% 76%, 0 98%)',
    }),
    heading: css({
        fontSize: '80px',
        lineHeight: '80px',
        color: 'white',
        fontWeight: '700',
        marginLeft: '16%',
    }),
    para: css({
        fontSize: '20px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginLeft: '16%',
    }),
    leftSection: css({
        width: '50%',
    }),
    rightSection: css({
        width: '50%',
    }),
    home: css({
        display: 'flex',
        marginTop: '100px',
        alignItems: 'center',
    }),
    fromWrapper: css({
        backgroundColor: 'white',
        width: '67.5%',
        margin: 'auto',
        padding: '40px',
        borderRadius: '15px',
    }),
    inputs: css({
        width: '100%',
        marginBottom: '20px',
        padding: '15px',
        borderRadius: '10px',
    }),
};
