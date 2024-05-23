import type { Socket } from "node:net";

const SocketsPool = (sockets?: Set<Socket>) => {
  const _sockets = sockets || new Set<Socket>();

  const onConnection = (socket: Socket) => {
    _sockets.add(socket);
    socket.once("close", () => _sockets.delete(socket));
  };

  const destroySocket = (socket: Socket) => {
    socket.destroy();
    _sockets.delete(socket);
  };

  const closeAll = async (): Promise<void> => _sockets.forEach(destroySocket);

  return {
    onConnection,
    closeAll,
  };
};

export default SocketsPool;
