### Lint and Formatter

`eslint` and `prettier` is used along each other. `eslint-config-airbnb-base` (not `eslint-config-airbnb`, which includes `jsx` rules) is used as well. [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest/issues) and [`eslint-plugin-markdown`](https://github.com/eslint/eslint-plugin-markdown) (not for markdown itself, but for code block snippet appeared in markdown) are also configured.

By configuring `overrides` in `.eslintrc.js`, both of typescript and javascript files are able to be linted by `eslint`. (e.g. So typescript rules are not applied to `.js` files.)

[`markdownlint`](https://github.com/DavidAnson/markdownlint) is configured by [`markdownlint-cli`](https://github.com/igorshubovych/markdownlint-cli#readme).

[`commitlint`](https://github.com/conventional-changelog/commitlint) is used as commit message linter. You can `yarn lint:md .`, for example. Refer to [conventional commits](https://www.conventionalcommits.org/en/) for more details.
