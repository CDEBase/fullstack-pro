/// <reference path='../../../../../typings/index.d.ts' />

import * as React from 'react';
import { HelmetData } from 'react-helmet';
import serialize from 'serialize-javascript';

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
	headElements,
	fela,
	env,
	assetMap,
	styleSheet,
	helmet,
}: {
	assetMap?: string[];
	content?: any;
	env: any;
	fela?: any;
	headElements: React.ReactElement<any>[];
	helmet?: HelmetData;
	reduxState: any;
	state: any;
	styleSheet?: any[];
}) => {
	const htmlAttrs = helmet.htmlAttributes.toComponent(); // react-helmet html document tags
	const bodyAttrs = helmet.bodyAttributes.toComponent(); // react-helmet body document tags
	return (
		<html lang='en' {...htmlAttrs}>
			<head>
				{helmet.title.toComponent()}
				{helmet.meta.toComponent()}
				{helmet.link.toComponent()}
				{helmet.style.toComponent()}
				{helmet.script.toComponent()}
				{helmet.noscript.toComponent()}
				{assetMap['vendor.js'] && (
					<script src={`${assetMap['vendor.js']}`} charSet='utf-8' />
				)}
				{headElements}
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1'
				/>
				<link
					rel='icon'
					type='image/png'
					href={`${assetMap['favicon-32x32.png']}`}
					sizes='32x32'
				/>
				<link
					rel='icon'
					type='image/png'
					href={`${assetMap['favicon-16x16.png']}`}
					sizes='16x16'
				/>
				<link rel='manifest' href={`${assetMap['manifest.xjson']}`} />
				<link
					rel='mask-icon'
					href={`${assetMap['safari-pinned-tab.svg']}`}
					color='#5bbad5'
				/>
				<link rel='shortcut icon' href={`${assetMap['favicon.ico']}`} />
				<meta
					name='msapplication-config'
					content={`${assetMap['browserconfig.xml']}`}
				/>
				<style id='font-stylesheet' />
				{!!__DEV__ && (
					<style
						dangerouslySetInnerHTML={{
							__html: modules.stylesInserts
								.map((style) => style._getCss())
								.join(''),
						}}
					/>
				)}
				{styleSheet.map(({ type, rehydration, css, media, support }) => (
					<style
						id='stylesheet'
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
				<div id='root' />
				<div className='demo'>
					<div
						id='content'
						dangerouslySetInnerHTML={{
							__html: content || '',
						}}
					/>
				</div>
				<script
					dangerouslySetInnerHTML={{
						__html: `window.__ENV__=${serialize(env, {
							isJSON: true,
						})};`,
					}}
					charSet='UTF-8'
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `window.__APOLLO_STATE__=${serialize(state, {
							isJSON: true,
						})};`,
					}}
					charSet='UTF-8'
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `window.__PRELOADED_STATE__=${serialize(reduxState, {
							isJSON: true,
						})};`,
					}}
					charSet='UTF-8'
				/>
			</body>
		</html>
	);
};

export { Html };
