'use strict'

const Hemera = require('nats-hemera')
const Code = require('code')
const Plugin = require('../')
const HemeraTestsuite = require('hemera-testsuite')

// assert library
const expect = Code.expect

// prevent warning message of too much listeners
process.setMaxListeners(0)

describe('hemera-plugin', function () {
  const PORT = 4222
  const topic = 'counter'
  let server

  // Start up our own nats-server
  before(function (done) {
    server = HemeraTestsuite.start_server(PORT, null, done)
  })

  // Shutdown our server after we are done
  after(function () {
    server.kill()
  })

  it('Should be able to add two numbers', function (done) {
    const nats = require('nats').connect()

    const hemera = new Hemera(nats, { logLevel: 'info' })
    hemera.use(Plugin)

    hemera.ready(() => {
      hemera.act({
        topic,
        cmd: 'add',
        a: 1,
        b: 2
      }, (err, resp) => {
        expect(err).not.to.be.exists()
        expect(resp).to.be.equals(3)

        hemera.close(done)
      })
    })
  })
})
