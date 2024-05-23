import type http from "node:http";
import type http2 from "node:http2";
import type https from "node:https";
import type tls from "node:tls";

interface ImprovedHttpServer extends http.Server {
  stop: () => Promise<void>;
}

interface ImprovedHttp2Server extends http2.Http2Server {
  stop: () => Promise<void>;
}

interface ImprovedHttp2SecureServer extends http2.Http2SecureServer {
  stop: () => Promise<void>;
}

interface ImprovedHttpsServer extends https.Server {
  stop: () => Promise<void>;
}

interface ImprovedTlsServer extends tls.Server {
  stop: () => Promise<void>;
}

export type ImprovedServer =
  | ImprovedHttpServer
  | ImprovedHttp2Server
  | ImprovedHttp2SecureServer
  | ImprovedHttpsServer
  | ImprovedTlsServer;
