import * as http from 'http'
import * as tls from 'tls'

interface ImprovedRegularServer extends http.Server {
  stop: () => Promise<void>
}

interface ImprovedSecureServer extends tls.Server {
  stop: () => Promise<void>
}

type ImprovedServer = ImprovedRegularServer | ImprovedSecureServer

export default ImprovedServer
