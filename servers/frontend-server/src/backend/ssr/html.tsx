/// <reference path='../../../../../typings/index.d.ts' />

import * as React from 'react';
import serialize from 'serialize-javascript';
import { HelmetData } from 'react-helmet';
import { Store } from 'redux';
import modules from '../../modules';

/**
 * A simple herlper function to prepare the HTML markup. This loads:
 *      - Page title
 *      - SEO meta tags
 *      - Preloaded state (for Redux, Apollo, additional Environment variables) depending on the current route
 *      - Code-split script tags depending on the current route
 * @param param0
 */
const Html = ({
    content,
    state,
    reduxState,
    fela,
    env,
    assetMap,
    styleSheet,
    helmet,
}:
    { content?: any, state: any, reduxState: any, assetMap?: string[], env: any, fela?: any, styleSheet?: any[], helmet?: HelmetData }) => {
    const htmlAttrs = helmet.htmlAttributes.toComponent(); // react-helmet html document tags
    const bodyAttrs = helmet.bodyAttributes.toComponent(); // react-helmet body document tags

    return (
        <html lang="en" {...htmlAttrs}>
            <head>
                {helmet.title.toComponent()}
                {helmet.meta.toComponent()}
                {helmet.link.toComponent()}
                <meta charSet="utf-8" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" />
                {<link rel="stylesheet" type="text/css" href={`${assetMap['index.css']}`} />}
                {<link rel="stylesheet" type="text/css" href={`${assetMap['vendor.css']}`} />}
                <style id="font-stylesheet" />
                {!!__DEV__ && (
                    <style
                        dangerouslySetInnerHTML={{
                            __html: modules.stylesInserts.map(style => style._getCss()).join(''),
                        }}
                    />
                )}
                {styleSheet.map(({ type, rehydration, css, media, support }) => (
                    <style
                        id="stylesheet"
                        dangerouslySetInnerHTML={{ __html: css }}
                        data-fela-rehydration={rehydration}
                        data-fela-type={type}
                        data-fela-support={support}
                        key={`${type}-${media}`}
                        media={media}
                    />
                ))}
                {modules.scriptsInserts.map((script, i) => {
                    if (script) {
                        return <script key={i} src={script} />;
                    }
                })}
            </head>
            <body {...bodyAttrs}>
                <div className="demo">
                    <div
                        id="content"
                        dangerouslySetInnerHTML={
                            {
                                __html: content ||
                                    'Try building the demo:<br/> ...and refreshing this page!',
                            }}
                    />
                </div>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__ENV__=${serialize(env, {
                            isJSON: true,
                        })};`,
                    }}
                    charSet="UTF-8"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__APOLLO_STATE__=${serialize(state, {
                            isJSON: true,
                        })};`,
                    }}
                    charSet="UTF-8"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__PRELOADED_STATE__=${serialize(reduxState, {
                            isJSON: true,
                        })};`,
                    }}
                    charSet="UTF-8"
                />
                {assetMap['vendor.js'] && <script src={`${assetMap['vendor.js']}`} charSet="utf-8" />}
                <script src={`${assetMap['index.js']}`} charSet="utf-8" />
            </body>
        </html>
    );
};

export { Html };
