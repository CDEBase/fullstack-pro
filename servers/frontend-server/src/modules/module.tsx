import '@sample-stack/assets';

import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import counterModules from '@sample-stack/counter-module-browser';
import { Layout } from 'antd';
import * as React from 'react';

import { SiderMenu } from './layout';

const features = new Feature(FeatureWithRouterFactory, counterModules);

console.log(features.getMenus());

export const MainRoute = (props) => (
	<Layout hasSider={true} style={{ minHeight: '100vh', display: 'flex' }}>
		<SiderMenu
			collapsed={false}
			menuData={features.getMenus()}
			location={window.location as any}
			segments={features.sidebarSegments}
		/>
		<Layout>
			<Layout.Content style={{ height: '100%' }}>
				<section className='flex-grow' style={{ height: '100%' }}>
					<React.Suspense fallback={<span>Loading....</span>}>
						{features.getRoutes()}
					</React.Suspense>
				</section>
			</Layout.Content>
		</Layout>
	</Layout>
);

export default features;
