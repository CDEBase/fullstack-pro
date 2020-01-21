import * as React from 'react';


import { ThemeProvider } from 'react-fela';
import { Complex } from './ComplexComponent';
import { theme } from '../theme';


const extendStyles = {
    container: {
        borderColor: 'black',
        borderRadius: '10px',
        borderStyle: 'solid',
    },
};


export const ComplexWithTheme: React.FunctionComponent<{}> = props => {


    return (
        <ThemeProvider theme={theme}>
            <Complex fontScale={10} extend={extendStyles} />
        </ThemeProvider>
    );

};
