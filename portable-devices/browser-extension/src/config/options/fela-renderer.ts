import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';
import { config } from '../config';

export default () => {
    const renderer = createRenderer({
        plugins: [...webPreset],
        devMode: config.NODE_ENV ? config.NODE_ENV !== 'production' : false,
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
