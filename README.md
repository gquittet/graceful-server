<h1 align="center">
  🚀 Graceful Server 🐢
</h1>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/github/package-json/v/gquittet/graceful-server?style=flat" alt="GitHub package.json version">
  </a>
  <a href="https://standardjs.com" target="_blank" rel="noopener">
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat" alt="JavaScript Style Guide">
  </a>
  <a href="https://www.npmjs.com/package/@gquittet/graceful-server" target="_blank" rel="noopener">
    <img src="https://img.shields.io/npm/types/@gquittet/graceful-server" alt="npm type definitions">
  </a>
  <a href="https://www.npmjs.com/package/@gquittet/graceful-server" target="_blank" rel="noopener">
    <img src="https://img.shields.io/npm/l/@gquittet/graceful-server" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/@gquittet/graceful-server" target="_blank" rel="noopener">
    <img src="https://img.shields.io/npm/dw/@gquittet/graceful-server" alt="npmjs download">
  </a>
  <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JN3XLTQCX3NR8&source=url" target="_blank" rel="noopener">
    <img src="https://img.shields.io/badge/Donate-PayPal-green.svg" alt="Donate with PayPal">
  </a>
</p>

<p align="center">
  Tiny (~5k), KISS, dependency-free Node.JS library to make your Rest API graceful.
</p>

---

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [NPM](#npm)
  - [Yarn](#yarn)
- [Endpoint](#endpoint)
  - [<code>/live</code>](#live)
  - [<code>/ready</code>](#ready)
- [Example](#example)
  - [ExpressJS](#expressjs)
  - [Fastify](#fastify)
  - [Koa](#koa)
  - [HTTP Server](#http-server)
- [API](#api)
  - [GracefulServer](#gracefulserver)
  - [IGracefulServerOptions](#igracefulserveroptions)
  - [GracefulServer Instance](#gracefulserver-instance)
- [Integration with Docker](#integration-with-docker)
  - [HEALTH CHECK in Dockerfile](#health-check-in-dockerfile)
  - [Content of _healthcheck.js_](#content-of-healthcheckjs)
  - [Example of Dockerfile](#example-of-dockerfile)
    - [POC level](#poc-level)
    - [Company level](#company-level)
- [Integration with Kubernetes](#integration-with-kubernetes)
- [Thanks](#thanks)
- [Sponsors](#sponsors)
- [Donate](#donate)

## Features

✔ It's listening system events to gracefully close your API on interruption.

✔ It facilitates the disconnect of data sources on shutdown.

✔ It facilitates the use of liveness and readiness.

✔ It manages the connections of your API.

✔ It avoid boilerplate codes.

✔ Dependency-free.

✔ KISS code base.

## Requirements

✔ NodeJS >= 10.13.0

## Installation

### NPM

```
npm install --save @gquittet/graceful-server
```

### Yarn

```
yarn add @gquittet/graceful-server
```

## Endpoint

Below you can find the default endpoint but you can setup or disable them. To do that, check out the [Options](#options) part.

<a name="lightship-behaviour-live"></a>

### <code>/live</code>

The endpoint responds:

- `200` status code with the uptime of the server in second.

```json
{ "uptime": 42 }
```

Used to configure liveness probe.

<a name="lightship-behaviour-ready"></a>

### <code>/ready</code>

The endpoint responds:

- `200` status code if the server is ready.

```json
{ "status": "ready" }
```

- `503` status code with an empty response if the server is not ready (started, shutting down, etc).

## Example

### ExpressJS

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

### Fastify

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
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    gracefulServer.setReady()
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
```

### Koa

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
  await connectToDb()
  gracefulServer.setReady()
})
```

As you can see, we're using the `app` object from Express to set up the endpoints and middleware.
But it can't listen (you can do it but `app` hasn't any liveness or readiness). The listening
of HTTP calls need to be done by the default NodeJS HTTP object (aka **_server_**).

### HTTP Server

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

## API

### GracefulServer

```typescript
;((server: http.Server, options?: IGracefulServerOptions | undefined) => IGracefulServer) & typeof State
```

where `State` is an enum that contains, `STARTING`, `READY`, `SHUTTING_DOWN` and `SHUTDOWN`.

### IGracefulServerOptions

All of the below options are optional.

| Name              |            Type            | Default |                                                      Description |
| ----------------- | :------------------------: | :-----: | ---------------------------------------------------------------: |
| closePromises     | (() => Promise<unknown>)[] |   []    |                    The functions to run when the API is stopping |
| timeout           |           number           |  1000   | The time in milliseconds to wait before shutting down the server |
| healthCheck       |          boolean           |  true   |    Enable/Disable the default endpoints (liveness and readiness) |
| livenessEndpoint  |           string           |  /live  |                                            The liveness endpoint |
| readinessEndpoint |           string           | /ready  |                                           The readiness endpoint |

### GracefulServer Instance

```typescript
export default interface IGracefulServer {
  isReady: () => boolean
  setReady: () => void
  on: (name: string, callback: (...args: any[]) => void) => EventEmitter
}
```

## Integration with Docker

### HEALTH CHECK in Dockerfile

```Dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["node healthcheck.js"]
```

### Content of _healthcheck.js_

```javascript
const http = require('http')

const options = {
  timeout: 2000,
  host: 'localhost',
  port: 8080,
  path: '/live'
}

const request = http.request(options, res => {
  console.info('STATUS:', res.statusCode)
  process.exitCode = res.statusCode === 200 ? 0 : 1
  process.exit()
})

request.on('error', err => {
  console.error('ERROR', err)
  process.exit(1)
})

request.end()
```

### Example of Dockerfile

#### POC level

```Dockerfile
FROM node:12-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["node healthcheck.js"]
CMD [ "node", "server.js" ]
```

#### Company level

```Dockerfile
FROM node:12-slim as base
ENV NODE_ENV=production
ENV TINI_VERSION=v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini && \
  mkdir -p /node_app/app && \
  chown -R node:node /node_app
WORKDIR /node_app
USER node
COPY --chown=node:node package.json package-lock*.json ./
RUN npm ci && \
  npm cache clean --force
WORKDIR /node_app/app

FROM base as source
COPY --chown=node:node . .

FROM source as dev
ENV NODE_ENV=development
ENV PATH=/node_app/node_modules/.bin:$PATH
RUN npm install --only=development --prefix /node_app
CMD ["nodemon", "--inspect=0.0.0.0:9229"]

FROM source as test
ENV NODE_ENV=development
ENV PATH=/node_app/node_modules/.bin:$PATH
COPY --from=dev /node_app/node_modules /node_app/node_modules
RUN npm run lint
ENV NODE_ENV=test
RUN npm test
CMD ["npm", "test"]

FROM test as audit
RUN npm audit --audit-level critical
USER root
ADD https://get.aquasec.com/microscanner /
RUN chmod +x /microscanner && \
    /microscanner your_token --continue-on-failure

FROM source as buildProd
ENV PATH=/node_app/node_modules/.bin:$PATH
COPY --from=dev /node_app/node_modules /node_app/node_modules
RUN npm run build

FROM source as prod
COPY --from=buildProd --chown=node:node /node_app/app/build ./build
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["node healthcheck.js"]
ENTRYPOINT ["/tini", "--"]
CMD ["node", "./build/src/main.js"]
```

## Integration with Kubernetes

```yml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  failureThreshold: 1
  initialDelaySeconds: 5
  periodSeconds: 5
  successThreshold: 1
  timeoutSeconds: 5
livenessProbe:
  httpGet:
    path: /live
    port: 8080
  failureThreshold: 3
  initialDelaySeconds: 10
  # Allow sufficient amount of time (90 seconds = periodSeconds * failureThreshold)
  # for the registered shutdown handlers to run to completion.
  periodSeconds: 30
  successThreshold: 1
  # Setting a very low timeout value (e.g. 1 second) can cause false-positive
  # checks and service interruption.
  timeoutSeconds: 5

# As per Kubernetes documentation (https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe),
# startup probe should point to the same endpoint as the liveness probe.
#
# Startup probe is only needed when container is taking longer to start than
# `initialDelaySeconds + failureThreshold × periodSeconds` of the liveness probe.
startupProbe:
  httpGet:
    path: /live
    port: 8080
  failureThreshold: 3
  initialDelaySeconds: 10
  periodSeconds: 30
  successThreshold: 1
  timeoutSeconds: 5
```

## Thanks

★ [Terminus](https://github.com/godaddy/terminus)

★ [Lightship](https://github.com/gajus/lightship)

★ [Stoppable](https://github.com/hunterloftis/stoppable)

★ [Bret Fisher](https://github.com/BretFisher) for his great articles and videos

★ [IBM documentation](https://cloud.ibm.com/docs/node?topic=nodejs-node-healthcheck)

★ [Node HTTP documentation](https://nodejs.org/api/http.html)

★ [Cloud Health](https://github.com/CloudNativeJS/cloud-health)

★ [Cloud Health Connect](https://github.com/CloudNativeJS/cloud-health-connect)

## Sponsors

<a href="https://jb.gg/OpenSource" target="_blank">

![JetBrains Logo](assets/sponsors/jetbrains.svg)

</a>

## Donate

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JN3XLTQCX3NR8&source=url)

If you like my job, don't hesite to contribute to this project! ❤️
