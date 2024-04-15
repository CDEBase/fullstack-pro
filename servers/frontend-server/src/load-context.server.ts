import "reflect-metadata";
import feature from './modules/module';
import { createReduxStore } from './config/redux-config';
import { createClientContainer } from './config/client.service';

export const loadContext = (req: Request, res: Response) => {
  const { container, serviceFunc, apolloClient } = createClientContainer(req, res);
  const services = serviceFunc();
  const { store } = createReduxStore(apolloClient, services, container);
  
  return {
    module: feature,
    store,
    container,
    apolloClient,
  }
}
