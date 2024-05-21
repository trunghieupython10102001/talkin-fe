import request from "@/classes/Request";
import { ICategoryResponse, ILivestreamRoom, ILivestreamRoomsResponse } from "@/interfaces/type";

export interface ILivestreamRoomsParams {
  status?: string;
  page?: number;
  size?: number;
  "creator.fullname_like"?: string;
  name_like?: string;
  listCategory_has?: string[];
  order_by?: string;
  sort_by?: string;
}

export const getLivestreamRooms = async (queryParams: ILivestreamRoomsParams, parseParams?: boolean) => {
  const response = await request.get("/livestream", queryParams, parseParams);
  return response.data as ILivestreamRoomsResponse;
};

export const getLivestreamRoom = async (roomId: string) => {
  const response = await request.get(`/livestream/${roomId}`);
  return response.data as ILivestreamRoom;
};

export const _checkLSRoomExists = async (id: string) => {
  const response = await request.get(`/livestream/${id}`);
  return response.data;
};

export const createLiveStream = async (body: any) => {
  return await request.post(`/livestream`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateLiveStream = async (payload: any) => {
  return await request.put(`/livestream/schedule`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getListCategories = async () => {
  const response = await request.get("/category");
  return response.data as ICategoryResponse;
};

export const deleteLSSchedule = async (id: string, hasSendMail: boolean) => {
  const response = await request.delete(`/livestream/schedule?id=${id}&hasSendMail=${hasSendMail}`);

  return response.data;
};
