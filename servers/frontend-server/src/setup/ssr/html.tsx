/// <reference path='../../../../../typings/index.d.ts' />

import * as React from 'react';
import * as serialize from 'serialize-javascript';
import { HelmetData } from 'react-helmet';
import { Store } from 'redux';

const Html = ({
    content,
    state,
    fela,
    env,
    assetMap,
    css,
    helmet,
}:
    { content?: any, state: any, assetMap?: string[], env: any, fela?: any, css?: string, helmet?: HelmetData }) => {
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
                {!__DEV__ && <link rel="stylesheet" type="text/css" href={`/${assetMap['index.css']}`} />}
                <style id="stylesheet" />
                <style id="font-stylesheet" />

            </head>
            <body {...bodyAttrs}>
                <div className="demo">
                    <div
                        id="content"
                        dangerouslySetInnerHTML={
                            {
                                __html: content ||
                                'Try building the demo:<br/> ...and refreshing this page!'
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
                {assetMap['vendor.js'] && <script src={`/${assetMap['vendor.js']}`} charSet="utf-8" />}
                <script src={`/${assetMap['index.js']}`} charSet="utf-8" />
            </body>
        </html>
    );
};

export { Html };
