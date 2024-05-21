import type { Socket } from "socket.io-client";
import { IClientToServerEvents, IServerToClientEvents } from "@/interfaces/socket";

export async function sendRequest(
  socket: Socket<IServerToClientEvents, IClientToServerEvents>,
  method: keyof IClientToServerEvents,
  data: Parameters<IClientToServerEvents[keyof IClientToServerEvents]>[0]
) {
  return new Promise<ReturnType<IClientToServerEvents[keyof IClientToServerEvents]>>((resolve) => {
    // @ts-ignore
    socket.emit(method, data, resolve);
  });
}
