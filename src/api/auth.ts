import request from "@/classes/Request";
import { IFormLogin, IFormRegister } from "@/interfaces/type";

export const _login = async (data: IFormLogin) => {
  const response = await request.post("/auth/signin", data);
  return response.data;
};

export const _register = async (data: IFormRegister) => {
  const response = await request.post("/auth/signup", data);
  return response.data;
};
