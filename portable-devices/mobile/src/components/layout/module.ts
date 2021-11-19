/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Feature } from '@common-stack/client-react';
import NativeBaseSample from './NativeBaseSample'
import Layout from './Layout';

export default new Feature({
  routeConfig: [
    {
      '/': {
        exact: true,
        component: NativeBaseSample,
      } as any,
    },
    // {
    //   '/org': {
    //     exact: false,
    //     component: Layout,
    //     key: 'layout',
    //   } as any,
    // },
  ],
});
