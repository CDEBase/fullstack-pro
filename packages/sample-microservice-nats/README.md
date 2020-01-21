# hemera-container-manager

Your plugin description

# Requirements

Make sure to set following environment properties

```
    process.env.CLOUDFLARE_EMAIL,
    process.env.CLOUDFLARE_KEY,
    process.env.CLOUDFLARE_ZONE_ID,
```
# Prerequisites

[Install and run NATS Server](http://nats.io/documentation/tutorials/gnatsd-install/)

# Example

```js
'use strict'

const Hemera = require('nats-hemera')
const Plugin = require('hemera-container-manager')
const nats = require('nats').connect()

const hemera = new Hemera(nats, {
  logLevel: 'info'
})

hemera.use(Plugin)

hemera.ready(() => {
  hemera.act({
    topic: 'container-manager',
    cmd: 'add',
    a: 1,
    b: 2
  }, function (err, resp) {
    this.log.info(resp, 'Result')
  })
})

```

# Test

```
npm run test
```

# Code coverage

```
npm run coverage
```

# Linting

```
npm run lint
```
