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
  <a href="https://dependents.info/gquittet/graceful-server" target="_blank" rel="noopener">
    <img src="https://dependents.info/gquittet/graceful-server/badge" alt="network dependents" />
  </a>
  <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JN3XLTQCX3NR8&source=url" target="_blank" rel="noopener">
    <img src="https://img.shields.io/badge/Donate-PayPal-green.svg" alt="Donate with PayPal">
  </a>
</p>

<p align="center">
  Tiny (~5k), KISS, dependency-free Node.js library to make your Rest API graceful.
</p>

---

- [Features](#features)
- [Used by](#used-by)
- [Requirements](#requirements)
- [Installation](#installation)
  - [NPM](#npm)
  - [PNPM](#pnpm)
  - [YARN](#yarn)
- [Endpoint](#endpoint)
  - [/live](#live)
  - [/ready](#ready)
- [Example](#example)
- [API Doc](#api-doc)
- [Integration with Docker](#integration-with-docker)
- [Integration with Kubernetes](#integration-with-kubernetes)
- [Thanks](#thanks)
- [Sponsors](#sponsors)
- [Donate](#donate)

## Features

✔ It's listening to system events to gracefully close your API on interruption.

✔ It facilitates the disconnect of data sources on shutdown.

✔ It facilitates the use of liveness and readiness.

✔ It manages the connections of your API.

✔ It avoids boilerplate codes.

✔ Kubernetes compliant.

✔ Dependency-free.

✔ KISS code base.

## Used by

<a href="https://dependents.info/gquittet/graceful-server" target="_blank" rel="noopener">
  <img src="https://dependents.info/gquittet/graceful-server/image" alt="network dependents" />
</a>

## Requirements

✔ NodeJS >= 18.0

## Installation

### NPM

```
npm install --save @gquittet/graceful-server
```

### PNPM

```
pnpm add @gquittet/graceful-server
```

### YARN

```
yarn add @gquittet/graceful-server
```

## Endpoint

Below, you can find the default endpoint, but you can set up or disable them. To do that, check out the [Options](#options) part.

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

- `503` status code with an empty response if the server is not ready (started, shutting down, etc.).

## Example

See: [EXAMPLE.md](./docs/EXAMPLE.md)

## API Doc

See: [API.md](./docs/API.md)

## Integration with Docker

See: [DOCKER.md](./docs/DOCKER.md)

## Integration with Kubernetes

See: [KUBERNETES.md](./docs/KUBERNETES.md)

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

If you like my job, don't hesitate to contribute to this project! ❤️
