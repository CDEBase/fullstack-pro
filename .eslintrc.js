const common = {
    env: {
        node: true,
        es6: true,
        'jest/globals': true,
    },
    plugins: ['prettier', 'jest', 'markdown'],
    extends: ['airbnb-base', 'prettier', 'plugin:jest/all', 'plugin:json/recommended'],
    rules: {
        'prettier/prettier': 'error',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
        'jest/expect-expect': 'off',
        'jest/prefer-expect-assertions': 'off',
        'jest/no-test-return-statement': 'off',
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'no-console': 'off',
        'no-iterator': 'off',
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',
        'consistent-return': 'off',
        'no-shadow': 'off',
        'no-unused-vars': 'off',
        "jsonc/indent": ["error",
            2,
            {}
        ]
    },
    globals: {
        fetch: true,
        window: true,
        document: true,
        __CDN_URL__: true,
        __DEV__: true,
        __TEST__: true,
        __CLIENT__: true,
        __SERVER__: true,
        __GRAPHQL_ENDPOINT__: true,
        __SSR__: true,
        __PERSIST_GQL__: true,
        __API_URL__: true,
        __WEBSITE_URL__: true,
        __FRONTEND_BUILD_DIR__: true,
    },
};

module.exports = {
    root: true,
    overrides: [
        {
            /*
        eslint-plugin-markdown only finds javascript code block snippet.
        For specific spec, refer to https://github.com/eslint/eslint-plugin-markdown
        */
            files: ['**/*.js', '**/*.md'],
            ...common,
        },
        {
            files: ['**/*.ts'],
            parser: '@typescript-eslint/parser',
            env: common.env,
            plugins: [...common.plugins, '@typescript-eslint'],
            extends: [
                ...common.extends,
                'plugin:@typescript-eslint/recommended',
                'plugin:import/errors',
                'plugin:import/warnings',
                'plugin:import/typescript',
            ],
            rules: {
                ...common.rules,
                '@typescript-eslint/explicit-function-return-type': 'off',
            },
            settings: {
                'import/resolver': {
                    node: {
                        extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx', '.graphql', '.gql'],
                    },
                    typescript: {
                        // alwaysTryTypes: true,
                        // paths: './tsconfig.json',
                    },
                },
            },
        },
    ],
};
