import type { Socket } from "node:net";
import { describe, expect, it, vi } from "vitest";
import SocketsPool from "#core/socketsPool";

const createMockSocket = () =>
  ({
    once: vi.fn(),
    destroy: vi.fn(),
  }) as unknown as Socket;

describe("socketsPool", () => {
  it("should add socket on connection and destroy it on closeAll", () => {
    expect.assertions(1);
    const pool = SocketsPool();
    const socket = createMockSocket();

    pool.onConnection(socket);
    pool.closeAll();

    expect(socket.destroy).toHaveBeenCalled();
  });

  it("should register close handler on socket", () => {
    expect.assertions(2);
    const pool = SocketsPool();
    const socket = createMockSocket();

    pool.onConnection(socket);

    expect(socket.once).toHaveBeenCalledWith("close", expect.any(Function));
    expect(socket.once).toHaveBeenCalledTimes(1);
  });

  it("should remove socket from pool when close event fires", () => {
    expect.assertions(1);
    const pool = SocketsPool();
    const socket = createMockSocket();

    pool.onConnection(socket);

    const closeHandler = (socket.once as ReturnType<typeof vi.fn>).mock.calls[0][1] as () => void;
    closeHandler();

    pool.closeAll();

    expect(socket.destroy).not.toHaveBeenCalled();
  });

  it("should destroy all sockets on closeAll", () => {
    expect.assertions(2);
    const socket1 = createMockSocket();
    const socket2 = createMockSocket();
    const pool = SocketsPool();

    pool.onConnection(socket1);
    pool.onConnection(socket2);
    pool.closeAll();

    expect(socket1.destroy).toHaveBeenCalled();
    expect(socket2.destroy).toHaveBeenCalled();
  });

  it("should accept a custom socket set", () => {
    expect.assertions(1);
    const socketSet = new Set<Socket>();
    const pool = SocketsPool(socketSet);
    const socket = createMockSocket();

    pool.onConnection(socket);

    expect(socketSet.has(socket)).toBe(true);
  });
});
