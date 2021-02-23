import { createBrowserHistory, createMemoryHistory, createHashHistory } from 'history';

if (__CLIENT__) {
    module.exports = createHashHistory();
} else {
    module.exports = (url) => createMemoryHistory({
        initialEntries: [url],
    });
}
