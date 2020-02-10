/*
 * samle-moleculer-plugin
 * Copyright (c) 2019 MoleculerJS (https://github.com/veeramarni/samle-moleculer-plugin)
 * MIT Licensed
 */

'use strict';
const ADD = 'test';
module.exports = {

    name: require('../package.json').name,
    // name: 'counter',

    /**
     * Default settings
     */
    settings: {

    },

    /**
     * Actions
     */
    actions: {
        test: async (ctx) => {
            return 'Hello ' + (await ctx.params.name || 'Anonymous');
        },
    },

    /**
     * Methods
     */
    methods: {

    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    stopped() {

    }
};
