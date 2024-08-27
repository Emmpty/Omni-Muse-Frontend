import service, { IBaseRes } from './request';
import { AxiosResponse } from "axios";

export interface BaseResponse {
  msg: string;
  code: number;
  result: any;
  [propsName: string]: any;
}

export function uploadReport(data: any): Promise<AxiosResponse<BaseResponse>> {
  return service({
    url: "/omnimuse/upload",
    method: "post",
    data: data,
  })
}