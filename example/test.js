const http = require('http')
const GracefulServer = require('../lib')

const server = http.createServer((req, res) => {
  if (req.url === '/test' && req.method === 'GET') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ uptime: process.uptime() | 0 }))
  }
  res.statusCode = 404
  return res.end()
})

const connectToDb = () =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log('Connected to database.')
      resolve()
    }, 5000)
  })

const closeDbConnection = () =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log('Disconnected from database.')
      resolve()
    }, 2000)
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
