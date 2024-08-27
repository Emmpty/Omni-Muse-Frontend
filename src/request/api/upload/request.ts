import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface IResponse<T> {
  message: string;
  code: number;
  result: T;
}

export type IBaseRes<T> = Promise<IResponse<T>>;

const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Accept-Language': 'zh-CN',
  },
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data;

    if (code === 401) {
      console.error(message);
    }
    if (code === 200) {
      return response.data;
    }

    if (response.data instanceof ArrayBuffer) {
      return response;
    }

    return Promise.reject(new Error(message || 'Error'));
  },
  (error) => {
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;

      if (code === 401) {
        console.error(message);
      }
    }
    return Promise.reject(error.message);
  }
);

export default service;
