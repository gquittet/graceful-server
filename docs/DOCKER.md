# Integration with Docker

## HEALTH CHECK in Dockerfile

```Dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["node healthcheck.js"]
```

## Content of _healthcheck.js_

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

## Example of Dockerfile

```Dockerfile
FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["node healthcheck.js"]
CMD [ "node", "server.js" ]
```
