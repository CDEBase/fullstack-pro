const common = {
	env: {
		node: true,
		'jest/globals': true,
	},
	plugins: ['prettier', 'jest', 'markdown'],
	extends: [
		'airbnb-base',
		'prettier',
		'plugin:jest/all',
		'plugin:json/recommended',
	],
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
		'jsonc/indent': ['error', 2, {}],
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
	extends: [
		'eslint:recommended',
		'plugin:typescript-sort-keys/recommended',
		'prettier',
	],
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
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:import/errors',
				'plugin:import/warnings',
				'plugin:import/typescript',
			],
			files: ['**/*.{ts,tsx}'],
			globals: common.globals,
		},
		{
			files: '*.json',
			parser: 'jsonc-eslint-parser',
			rules: {
				'jsonc/sort-keys': 'error',
			},
			extends: ['plugin:jsonc/recommended-with-json'],
		},
		{
			files: '**/*.test.ts',
			rules: {
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-call': 'off',
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json'],
	},
	plugins: ['@typescript-eslint', 'simple-import-sort', 'typescript-sort-keys'],
	root: true,
	rules: {
		'simple-import-sort/exports': 'error',
		'simple-import-sort/imports': 'error',
	},
};
