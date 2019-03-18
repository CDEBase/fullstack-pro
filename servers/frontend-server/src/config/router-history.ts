import { createBrowserHistory, createMemoryHistory } from 'history';

if (__CLIENT__) {
    module.exports = createBrowserHistory();
} else {
    module.exports = (url) => createMemoryHistory({
        initialEntries: [url],
    });
}
