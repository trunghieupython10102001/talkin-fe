import request from "@/classes/Request";
import { IFormProfile, IProfile } from "@/interfaces/type";
import { AxiosResponse } from "axios";

export const uploadAvatar = async (formData: any) => {
  return await request.post("/user/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProfile = async (): Promise<AxiosResponse<IProfile>> => {
  return await request.get("/user/profile");
};

export const updateProfile = async (data: IFormProfile) => {
  return await request.put("/user/profile", data);
};

export const updateProfileWallet = async (data: { address: string }) => {
  return await request.put("/user/wallet", data);
};
