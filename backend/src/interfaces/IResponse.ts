export interface IResponse {
  status: boolean;
  message: string;
}

export interface IHealthResponse extends IResponse {
  uptime: number;
}

export interface IUserResponse extends IResponse {
  user: {
    id: number;
    email: string;
    name: string;
  };
}
