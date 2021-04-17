
Sample Style Sheet implementation. 

```js
import * as CSS from 'csstype';

const DefaultSettingsView = (props: IDefaultSettings) => {

    const { css, theme } = useFela();

    return(()=> {
            <div className={css(styleSheet.title)}>
                <span className={css(styleSheet.note({ width: width || 0 }))}>test</span>
            </div>
    })

}
const styleSheet: { [key: string]: (x: any) => CSS.Properties } = {
    resizable: () => ({
        position: 'relative',
        '> .react-resizable-handle': {
            position: 'absolute',
            width: '3px',
            height: '100%',
            top: 0,
            right: 0,
            padding: '0 3px 3px 0',
            boxSizing: 'border-box',
            cursor: 'col-resize',
        },
    }),
    title: ({ theme }) => ({
        textTransform: 'uppercase',
        padding: '5px 0',
        fontSize: '11px',
        marginLeft: '33px',
        color: theme.name === 'light' ? '#424242bd' : '#e7e7e77a',
        boxShadow: theme.name === 'light' ? '0px 1px 2px 0px #f3f3f3' : '0px 1px 2px 0px #000000',
        marginBottom: '2px',
    }),
    note: ({ width }) => ({
        marginLeft: '33px',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
        display: 'block',
        maxWidth: width,
        overflow: 'hidden',
    }),
};

```