import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';

export default () => {
    const renderer = createRenderer({
        plugins: [...webPreset],
        devMode: process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : false,
    });
    renderer.renderStatic(
        `
        html, body, #root{
            height: 100%;
            }
        `,
    );

    return renderer;
};
