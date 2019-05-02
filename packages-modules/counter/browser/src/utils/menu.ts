export const getFilteredMenus = (accountPageStore, selectedMenu) =>
    accountPageStore.map(item => {
        if (selectedMenu.indexOf(item.key) !== -1) {
            const { path, component, ...rest } = item;
            return {
                [path]: { name: rest.tab, ...rest },
            };
        }
    }).filter(valid => valid);


export const getFilteredRoutes = (accountPageStore, selectedRoutes) =>
    accountPageStore.map(item => {
        if (selectedRoutes.indexOf(item.key) !== -1) {
            const { path } = item;
            return {
                [path]: item,
            };
        }
        return null;
    }).filter(valid => valid);

export const getFilteredTabs = (accountPageStore, selectedTabs) =>
    accountPageStore.map(item => {
        if (selectedTabs.indexOf(item.key) !== -1) {
            const { component, ...rest } = item;
            return rest;
        }
    }).filter(valid => valid);
