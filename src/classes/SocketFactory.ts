import { COOKIES_STORAGE_KEY } from "@/constants";
import { IClientSocketQuery } from "@/interfaces/socket";
import Cookies from "js-cookie";

class SocketFactory {
  getSocketConnectURL(roomId: string, device: string, isLivestreamRoom = false): string {
    const accessToken = Cookies.get(COOKIES_STORAGE_KEY.ACCESS_TOKEN) || "";

    const queries: IClientSocketQuery = {
      device,
      roomId,
      isLivestreamRoom: String(isLivestreamRoom),
    };

    if (accessToken) {
      queries.accessToken = accessToken;
    }

    const searchParams = new URLSearchParams(queries);

    return `${process.env.REACT_APP_BE_SOCKET_URL}?${searchParams.toString()}`;
  }

  getDefaultSocketURL(): string {
    return process.env.REACT_APP_BE_SOCKET_URL || `wss://${window.location.host}`;
  }

  createSocketEmitRequest(method: string, data?: object) {
    return { method, data: data || {} };
  }
}

export const socketFactory = new SocketFactory();
