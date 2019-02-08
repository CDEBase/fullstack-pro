import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

if (__CLIENT__) {
    module.exports = createBrowserHistory();
} else {
    module.exports = (url) => createMemoryHistory({
        initialEntries: [url],
    });
}
