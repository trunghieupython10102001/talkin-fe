import request from "@/classes/Request";
import { IInviteResponse } from "@/interfaces/type";

export const _createInviteLink = async () => {
  const response = await request.post("/room");
  return response.data as IInviteResponse;
};

export const _joinCall = async (id: string) => {
  const response = await request.get(`/room/${id}`);
  return response.data as IInviteResponse;
};
