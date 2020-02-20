import * as net from 'net'

const SocketsPool = (sockets?: Set<net.Socket>) => {
  const _sockets = sockets || new Set<net.Socket>()

  const onConnection = (socket: net.Socket) => {
    _sockets.add(socket)
    socket.once('close', () => _sockets.delete(socket))
  }

  const destroySocket = (socket: net.Socket) => {
    socket.destroy()
    _sockets.delete(socket)
  }

  const closeAll = async (): Promise<void> => _sockets.forEach(destroySocket)

  return {
    onConnection,
    closeAll
  }
}

export default SocketsPool
