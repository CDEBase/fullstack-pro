import * as React from 'react';
import { createCache as createAntdCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

const antdCache = createAntdCache();
export const styleSheet = extractStyle(antdCache);
export const AntSytles = ({ children }: { children: React.ReactNode }) => (
    <StyleProvider cache={antdCache}>{children}</StyleProvider>
);
