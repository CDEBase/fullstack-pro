

Migrating from 0.1.x to 0.2.0
====
Before
---
```
import { graphql, gql } from 'react-apollo';
```
After
---
```
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
```