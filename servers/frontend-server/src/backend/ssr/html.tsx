/// <reference path='../../../../../typings/index.d.ts' />

import * as React from 'react';
import serialize from 'serialize-javascript';
import { HelmetServerState } from 'react-helmet-async';
import { ChunkExtractor } from '@loadable/server';

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
    emotionIds,
    headElements,
    env,
    assetMap,
    styleSheet,
    helmet,
    extractor,
    stylesInserts = [],
    scriptsInserts = [],
}: {
    content?: any;
    state: any;
    reduxState: any;
    emotionIds: string[];
    headElements: React.ReactElement<any>[];
    assetMap?: string[];
    env: any;
    styleSheet?: any;
    helmet: HelmetServerState;
    extractor: ChunkExtractor;
    stylesInserts?: any[];
    scriptsInserts?: string[];
}) => {
    const htmlAttrs = helmet.htmlAttributes.toComponent(); // react-helmet html document tags
    const bodyAttrs = helmet.bodyAttributes.toComponent(); // react-helmet body document tags

    // console.log('--- html attributes >>>>', helmet.title.toComponent(), helmet.meta.toComponent());
    return (
        <html lang="en" {...htmlAttrs}>
            <head>
                {helmet.title.toComponent()}
                {helmet.meta.toComponent()}
                {helmet.link.toComponent()}
                {helmet.style.toComponent()}
                {helmet.script.toComponent()}
                {helmet.noscript.toComponent()}
                {extractor.getLinkElements()}
                {extractor.getStyleElements()}
                {assetMap['vendor.js'] && <script src={`${assetMap['vendor.js']}`} charSet="utf-8" />}
                {/* {headElements} */}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="icon" type="image/png" href={`${assetMap['favicon-32x32.png']}`} sizes="32x32" />
                <link rel="icon" type="image/png" href={`${assetMap['favicon-16x16.png']}`} sizes="16x16" />
                <link rel="manifest" href={`${assetMap['manifest.xjson']}`} />
                <link rel="mask-icon" href={`${assetMap['safari-pinned-tab.svg']}`} color="#5bbad5" />
                <link rel="shortcut icon" href={`${assetMap['favicon.ico']}`} />
                <meta name="msapplication-config" content={`${assetMap['browserconfig.xml']}`} />
                <style id="font-stylesheet" />
                {!!__DEV__ && (
                    <style
                        dangerouslySetInnerHTML={{
                            __html: stylesInserts.map((style) => style._getCss()).join(''),
                        }}
                    />
                )}
                {/* {styleSheet} */}
                {scriptsInserts.map((script, i) => {
                    if (script) {
                        return <script key={i} src={script} />;
                    }
                })}
            </head>
            <body {...bodyAttrs}>
                <div id="root" dangerouslySetInnerHTML={{ __html: content }}></div>
                {/* <div className="demo">
                    <div
                        id="content"
                        dangerouslySetInnerHTML={{
                            __html: content || '',
                        }}
                    />
                </div> */}
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
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__EMOTION_IDS__=${serialize(emotionIds, {
                            isJSON: false,
                        })};`,
                    }}
                    charSet="UTF-8"
                />
                {extractor.getScriptElements()}
            </body>
        </html>
    );
};

export { Html };
