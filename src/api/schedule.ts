import request from "@/classes/Request";
import { TCreateSchedule, IFormSchedule } from "@/interfaces/type";
import { AxiosResponse } from "axios";
export const getDetailSchedule = async (roomId: string) => {
  const response: AxiosResponse<IFormSchedule> = await request.get(`/room/${roomId}`);

  return response;
};

export const createSchedule = async (data: TCreateSchedule) => {
  if (!data) return;

  const response: AxiosResponse<IFormSchedule> = await request.post(`/room/schedule`, data);

  return response;
};

export const updateSchedule = async (data: IFormSchedule) => {
  if (!data) return;

  const response: AxiosResponse<IFormSchedule> = await request.put(`/room/schedule`, data);

  return response;
};

export const deleteSchedule = async (roomId: string, hasSendMail?: boolean) => {
  if (!roomId) return;

  const response: AxiosResponse = await request.delete(`/room/schedule?id=${roomId}&hasSendMail=${hasSendMail}`);

  return response;
};
