'use strict';
const GreeterService = {
    name: 'greeter',
    /**
     * Service settings
     */
    settings: {},
    /**
     * Service dependencies
     */
    dependencies: [],
    /**
     * Actions
     */
    actions: {
        /**
         * Say a 'Hello'
         *
         * @returns
         */
        hello() {
            return 'Hello Moleculer';
        },
        /**
         * Welcome a username
         *
         * @param {String} name - User name
         */
        welcome: {
            params: {
                name: 'string',
            },
            handler(ctx) {
                return `Welcome, ${ctx.params.name}`;
            },
        },
    },
    /**
     * Events
     */
    events: {},
    /**
     * Methods
     */
    methods: {},
    /**
     * Service created lifecycle event handler
     */
    created() {
    },
};
module.exports = GreeterService;
//# sourceMappingURL=greeter.service.js.map