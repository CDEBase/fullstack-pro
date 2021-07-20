/* eslint-disable import/no-extraneous-dependencies */
import { osx, windows as _windows, main, renderer } from 'electron-is/is';

/**
 * Determine whether it is a mac platform
 */
export const isMacOS = osx();

/**
 * Determine whether it is windows
 */
export const isWindows = _windows();

export const isMain = main();

export const isRenderer = renderer();

export const isDev = process.env.NODE_ENV === 'development';

export const isTest = process.env.NODE_ENV === 'test';
