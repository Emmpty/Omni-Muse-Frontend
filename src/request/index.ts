import { showNotification } from '@mantine/notifications';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { handleSignOut } from '~/request/api/login';

export interface IResponse<T> {
  message: string;
  code: number;
  result: T;
}

export type IBaseRes<T> = Promise<IResponse<T>>;

const handleLoginExpired = () => {
  const times = 3000;
  showNotification({
    message: 'the login has expired and the login page has been redirected.',
    color: 'red',
    autoClose: times,
  });
  setTimeout(() => {
    handleSignOut();
  }, times);
};

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
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('token');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    } else {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data;
    if (code === 401) {
      handleLoginExpired();
    }

    if (response.data instanceof ArrayBuffer) {
      return response;
    }

    if (code === 200) {
      return response.data;
    }

    // return Promise.reject(new Error(message || 'Error'));
    return response.data;
  },
  (error) => {
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      if (code === 401) {
        handleLoginExpired();
      }
    }
    return Promise.reject(error.message);
  }
);

export default service;
