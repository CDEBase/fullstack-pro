import * as React from 'react';
import * as serialize from 'serialize-javascript';
import { HelmetData } from 'react-helmet';
import { Store } from 'redux';

const Html = ({ content, state, assetMap, css, helmet }:
    { content?: string, state: Store<any> | {}, assetMap?: string, css?: string, helmet?: HelmetData }) => {
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
                <link rel="apple-touch-icon" sizes="180x180" href={`/${assetMap['apple-touch-icon.png']}`} />
                <link rel="icon" type="image/png" href={`/${assetMap['favicon-32x32.png']}`} sizes="32x32" />
                <link rel="icon" type="image/png" href={`/${assetMap['favicon-16x16.png']}`} sizes="16x16" />
                <link rel="manifest" href={`/${assetMap['manifest.json']}`} />
                <link rel="mask-icon" href={`/${assetMap['safari-pinned-tab.svg']}`} color="#5bbad5" />
                <link rel="shortcut icon" href={`/${assetMap['favicon.ico']}`} />
                <meta name="msapplication-config" content={`/${assetMap['browserconfig.xml']}`} />
                <meta name="theme-color" content="#ffffff" />
                {!__DEV__ && <link rel="stylesheet" type="text/css" href={`/${assetMap['index.css']}`} />}
                {/* {!!__DEV__ && (
                    <style
                        dangerouslySetInnerHTML={{
                            __html: styles._getCss()
                        }}
                    />
                )} */}
                {!!css && css}
            </head>
            <body {...bodyAttrs}>
                <div id="content" dangerouslySetInnerHTML={{ __html: content || '' }} />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__APOLLO_STATE__=${serialize(state, {
                            isJSON: true,
                        })};`,
                    }}
                    charSet="UTF-8"
                />
                {assetMap['vendor.js'] && <script src={`/${assetMap['vendor.js']}`} charSet="utf-8" />}
                <script src={`/${assetMap['index.js']}`} charSet="utf-8" />
            </body>
        </html>
    );
};

export { Html };
