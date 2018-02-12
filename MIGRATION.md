

Migrating from 0.1.x to 0.2.0
====
Before
---
```
import { graphql, gql, ApolloError } from 'react-apollo';
```
After
---
```
import { graphql } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import gql from 'graphql-tag';
```


Issues
-----
- If you you encounter `npm ERR! Cannot read property '0' of undefined`then remove `node_modules` and reinstall the packages.
