import * as http from 'http'
import * as tls from 'tls'

type HttpServer = http.Server | tls.Server

export default HttpServer
