export interface OurUsers {
  id?: number;
  name: string;
  email: string;
  city?: string;
  role?: string;
  password?: string;
}

export interface ReqRes {
  status?: number;
  message?: string;
  error?: string;
  token?: string;
  refreshToken?: string;
  expirationToken?: string;
  ourUsers?: OurUsers;
  ourUsersList?: OurUsers[];
}
