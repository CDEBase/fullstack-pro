import {GRAPHQL_ROUTE, GRAPHIQL_ROUTE, main} from './main';
import {get as httpGet, Server} from 'http';
import 'jest';

const ERRNO_KEY = 'errno';
const PORT: number = 8080;

function getFromServer(uri) {
  return new Promise((resolve, reject) => {
    httpGet(`http://localhost:${PORT}${uri}`, (res) => {
      resolve(res);
    }).on('error', (err: Error) => {
      reject(err);
    });
  });
}

describe('main', () => {
  it('should be able to Initialize a server (production)', () => {
    return main({
      enableCors: false,
      enableGraphiql: false,
      env: 'production',
      port: PORT,
    })
    .then(([server]) => {
      return (<Server>server).close();
    });
  });

  it('should be able to Initialize a server (development)', () => {
    return main({
      enableCors: true,
      enableGraphiql: true,
      env: 'dev',
      port: PORT,
    })
    .then(([server]) => {
      return (<Server>server).close();
    });
  });

  it('should have a working GET graphql (developemnt)', () => {
    return main({
      enableCors: true,
      enableGraphiql: true,
      env: 'dev',
      port: PORT,
    })
    .then(([server]) => {
      return getFromServer(GRAPHQL_ROUTE).then((res: any) => {
        (<Server>server).close();
        // GET without query returns 400
        expect(res.statusCode).toBe(400);
      });
    });
  });

  it('should have a working GET graphql (production)', () => {
    return main({
      enableCors: false,
      enableGraphiql: false,
      env: 'production',
      port: PORT,
    })
    .then(([server]) => {
      return getFromServer(GRAPHQL_ROUTE).then((res: any) => {
        (<Server>server).close();
        // GET without query returns 400
        expect(res.statusCode).toBe(400);
      });
    });
  });

  it('should have a working graphiql (developemnt)', () => {
    return main({
      enableCors: true,
      enableGraphiql: true,
      env: 'dev',
      port: PORT,
    })
    .then(([server]) => {
      return getFromServer(GRAPHIQL_ROUTE).then((res: any) => {
        (<Server>server).close();
        expect(res.statusCode).toBe(200);
      });
    });
  });

  it('should have block graphiql (production)', () => {
    return main({
      enableCors: false,
      enableGraphiql: false,
      env: 'production',
      port: PORT,
    })
    .then(([server]) => {
      return getFromServer(GRAPHIQL_ROUTE).then((res: any) => {
        (<Server>server).close();
        expect(res.statusCode).toBe(404);
      });
    });
  });

  it('should reject twice on same port', () => {
    return main({
      enableCors: false,
      enableGraphiql: false,
      env: 'production',
      port: PORT,
    })
    .then(([server]) => {
      return main({
        enableCors: false,
        enableGraphiql: false,
        env: 'production',
        port: PORT,
      })
      .then(([secondServer]) => {
        (<Server>server).close();
        (<Server>secondServer).close();
        throw new Error('Was able to listen twice!');
      }, (err: Error) => {
        (<Server>server).close();
        expect(err[ERRNO_KEY]).toBe('EADDRINUSE');
      });
    });
  });
});
