export interface IResponse {
  status: boolean;
  message: string;
}

export interface IHealthResponse extends IResponse {
  uptime: number;
}
