import * as http from 'http'
import * as http2 from 'http2'
import * as https from 'https'
import * as tls from 'tls'

type Server = http.Server | http2.Http2Server | http2.Http2SecureServer | https.Server | tls.Server

export default Server
