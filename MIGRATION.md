


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