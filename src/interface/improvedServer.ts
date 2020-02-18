import http from 'http'

export default interface ImprovedServer extends http.Server {
  stop: () => Promise<void>
}
