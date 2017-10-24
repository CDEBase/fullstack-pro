import { createRenderer, IRenderer } from 'fela';
import prefixer from 'fela-plugin-prefixer';
import fallbackValue from 'fela-plugin-fallback-value';
import unit from 'fela-plugin-unit';
import lvha from 'fela-plugin-lvha';
import validator from 'fela-plugin-validator';
import logger from 'fela-plugin-logger';
const { renderToMarkup } = require('fela-dom');
import perf from 'fela-perf';
import beautifier from 'fela-beautifier';
import fontRenderer from 'fela-font-renderer';

export default (fontNode) => {
    const renderer = createRenderer({
        plugins: [prefixer(), fallbackValue(), unit(), lvha(), validator({})],
        enhancers: [/*perf(),*/ beautifier(), fontRenderer(fontNode)],
    });
    if (__SERVER__) {
        return renderToMarkup(renderer);
    }
    return renderer;
};

