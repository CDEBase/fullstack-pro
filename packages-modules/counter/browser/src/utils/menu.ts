const filterStore = (store, selected) => {
    const cloned = [...store];
    cloned.forEach((item) => {
        if (Array.isArray(item.routes)) {
            item.routes = filterStore(item.routes, selected);
            if (item.routes.length < 1) {
                delete item.routes;
            }
        }
    });

    return cloned.filter((item) => Array.isArray(item.routes) || selected.indexOf(item.key) !== -1);
};

export const getFilteredMenus = (accountPageStore, selectedMenu) =>
    filterStore(accountPageStore, selectedMenu).map((item) => {
        const { path, component, ...rest } = item;
        return {
            [path]: { name: rest.tab, ...rest },
        };
    });

export const getFilteredRoutes = (accountPageStore, selectedRoutes) =>
    filterStore(accountPageStore, selectedRoutes).map((item) => {
        const { path } = item;
        return {
            [path]: item,
        };
    });

export const getFilteredTabs = (accountPageStore, selectedTabs) =>
    filterStore(accountPageStore, selectedTabs).map((item) => {
        const { component, ...rest } = item;
        return rest;
    });
