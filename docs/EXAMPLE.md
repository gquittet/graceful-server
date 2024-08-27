# Example

- [Example](#example)
  - [ExpressJS](#expressjs)
  - [Fastify](#fastify)
  - [Koa](#koa)
  - [HTTP Server](#http-server)


## ExpressJS

The library works with the default HTTP NodeJS object. So, when you're using Express you can't pass
directly the `app` object from Express. But, you can easily generate an HTTP NodeJS object from the `app` object.

Just follow the bottom example:

```javascript
const express = require('express')
const helmet = require('helmet')
const http = require('http')
const GracefulServer = require('@gquittet/graceful-server')
const { connectToDb, closeDbConnection } = require('./db')

const app = express()
const server = http.createServer(app)
const gracefulServer = GracefulServer(server, { closePromises: [closeDbConnection] })

app.use(helmet())

app.get('/test', (_, res) => {
  return res.send({ uptime: process.uptime() | 0 })
})

gracefulServer.on(GracefulServer.READY, () => {
  console.log('Server is ready')
})

gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  console.log('Server is shutting down')
})

gracefulServer.on(GracefulServer.SHUTDOWN, error => {
  console.log('Server is down because of', error.message)
})

server.listen(8080, async () => {
  await connectToDb()
  gracefulServer.setReady()
})
```

As you can see, we're using the `app` object from Express to set up the endpoints and middleware.
But it can't listen (you can do it but `app` hasn't any liveness or readiness). The listening
of HTTP calls need to be done by the default NodeJS HTTP object (aka **_server_**).

## Fastify

```javascript
const fastify = require('fastify')({ logger: true })
const GracefulServer = require('@gquittet/graceful-server')

const gracefulServer = GracefulServer(fastify.server)

gracefulServer.on(GracefulServer.READY, () => {
  console.log('Server is ready')
})

gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  console.log('Server is shutting down')
})

gracefulServer.on(GracefulServer.SHUTDOWN, error => {
  console.log('Server is down because of', error.message)
})

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    gracefulServer.setReady()
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
```

**Be careful, if you are using Fastify v4.x.x with Node 16 and below**, you have to use

```javascript
await fastify.listen({ port: 3000, host: '0.0.0.0' })
```

because Node 16 and below does not support multiple addresses binding.

See: https://github.com/fastify/fastify/issues/3536

## Koa

```javascript
const GracefulServer = require('@gquittet/graceful-server')
const Koa = require('koa')
const http = require('http')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

const server = http.createServer(app.callback())
gracefulServer = GracefulServer(server)

router.get('/test')
app.use(router.routes())

// response
app.use(ctx => {
  ctx.body = 'Hello Koa'
})

gracefulServer.on(GracefulServer.READY, () => {
  console.log('Server is ready')
})

gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  console.log('Server is shutting down')
})

gracefulServer.on(GracefulServer.SHUTDOWN, error => {
  console.log('Server is down because of', error.message)
})

server.listen(8080, async () => {
  gracefulServer.setReady()
})
```

As you can see, we're using the `app` object from Express to set up the endpoints and middleware.
But it can't listen (you can do it but `app` hasn't any liveness or readiness). The listening
of HTTP calls need to be done by the default NodeJS HTTP object (aka **_server_**).

## HTTP Server

```javascript
import http from 'http'
import url from 'url'
import GracefulServer from '@gquittet/graceful-server'
import { connectToDb, closeDbConnection } from './db'

const server = http.createServer((req, res) => {
  if (req.url === '/test' && req.method === 'GET') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ uptime: process.uptime() | 0 }))
  }
  res.statusCode = 404
  return res.end()
})

const gracefulServer = GracefulServer(server, { closePromises: [closeDbConnection] })

gracefulServer.on(GracefulServer.READY, () => {
  console.log('Server is ready')
})

gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  console.log('Server is shutting down')
})

gracefulServer.on(GracefulServer.SHUTDOWN, error => {
  console.log('Server is down because of', error.message)
})

server.listen(8080, async () => {
  await connectToDb()
  gracefulServer.setReady()
})
```
