import path from 'path';
import { logger } from '@cdm-logger/server';

const getServerSideRenderer = async () => {
  let renderer;
  if (__CHAKRA__) {
    if (__ANTUI__) {
      renderer = await import('../website-chakra-antui');
    } else {
      renderer = await import('../website-chakra');
    }
  } else {
    renderer = await import('../website-antui');
  }

  return renderer.default;
}

export const websiteMiddleware = async (req, res, next) => {
  try {
    if (req.path.indexOf('.') < 0 && __SSR__) {
      const renderServerSide = await getServerSideRenderer();
      if (renderServerSide) {
        return await renderServerSide(req, res);
      }
      next();
    } else if (req.path.indexOf('.') < 0 && !__SSR__ && req.method === 'GET' && !__DEV__) {
      logger.debug('FRONEND_BUILD_DIR with index.html');
      res.sendFile(path.resolve(__FRONTEND_BUILD_DIR__, 'index.html'));
    } else {
      next();
    }
  } catch (e) {
    logger.error('RENDERING ERROR:', e);
    return next(e);
  }
};
