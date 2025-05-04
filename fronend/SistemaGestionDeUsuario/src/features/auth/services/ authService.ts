import { ReqRes } from "../types";
import { api } from "../../../api/api";

export const login = async (credential: {
  email: string;
  password: string;
}): Promise<ReqRes> => {
  const response = api.post<ReqRes>("/login", credential);
  return (await response).data;
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  city: string;
}): Promise<ReqRes> => {
  const response = api.post<ReqRes>("/register", userData);
  return (await response).data;
};

export const refreshToken = async (refreshToken: string): Promise<ReqRes> => {
  const response = api.post<ReqRes>("/refresh", { refreshToken });
  return (await response).data;
};
