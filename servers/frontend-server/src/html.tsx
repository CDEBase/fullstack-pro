import * as React from 'react';
import serialize from 'serialize-javascript';
import { HelmetData } from 'react-helmet';
import { Store } from 'redux';

const Html = ({ content, state, assetMap, css, helmet }:
    { content?: string, state: Store<any>, assetMap?: string, css?: string, helmet?: HelmetData }) => {
    const htmlAttrs = helmet.htmlAttributes.toComponent(); // react-helmet html document tags
    const bodyAttrs = helmet.bodyAttributes.toComponent(); // react-helmet body document tags

    return (
        <html lang="en" {...htmlAttrs}>
            <head>
                {helmet.title.toComponent()}
                {helmet.meta.toComponent()}
                {helmet.link.toComponent()}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" href={`/${assetMap['favicon.ico']}`} />
                {!__DEV__ && <link rel="stylesheet" type="text/css" href={`/${assetMap['bundle.css']}`} />}
                {!!css && css}
            </head>
            <body {...bodyAttrs} >
                <div id="content" dangerouslySetInnerHTML={{ __html: content || '' }} />
                <script
                    dangerouslySetInnerHTML={{ __html: `window.__APOLLO_STATE__=${serialize(state, { isJSON: true })};` }}
                    charSet="UTF-8"
                />
                {assetMap['vendor.js'] && <script src={`/${assetMap['vendor.js']}`} charSet="utf-8" />}
                <script src={`/${assetMap['bundle.js']}`} charSet="utf-8" />
            </body>
        </html>
    );
};

export { Html };
