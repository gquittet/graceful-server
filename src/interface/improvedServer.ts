import type * as http from 'http';
import type * as http2 from 'http2';
import type * as https from 'https';
import type * as tls from 'tls';

interface ImprovedHttpServer extends http.Server {
  stop: () => Promise<void>
}

interface ImprovedHttp2Server extends http2.Http2Server {
  stop: () => Promise<void>
}

interface ImprovedHttp2SecureServer extends http2.Http2SecureServer {
  stop: () => Promise<void>
}

interface ImprovedHttpsServer extends https.Server {
  stop: () => Promise<void>
}

interface ImprovedTlsServer extends tls.Server {
  stop: () => Promise<void>
}

export type ImprovedServer =
  | ImprovedHttpServer
  | ImprovedHttp2Server
  | ImprovedHttp2SecureServer
  | ImprovedHttpsServer
  | ImprovedTlsServer
