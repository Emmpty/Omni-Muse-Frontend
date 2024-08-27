import service, { IBaseRes } from '~/request/index';
import { AxiosResponse } from 'axios';

export interface BaseResponse {
  msg: string;
  code: number;
  result: any;
  [propsName: string]: any;
}

export function draftCreate(data: any): IBaseRes<any> {
  return service({
    url: '/v1/image/draft_create',
    method: 'post',
    data: data,
  });
}

export function queuelist(data: any): IBaseRes<any> {
  return service({
    url: '/v1/image/queue_page',
    method: 'post',
    data: data,
  });
}

export function deleteQueue(data: any): IBaseRes<any> {
  return service({
    url: '/v1/image/queue_delete',
    method: 'post',
    data: data,
  });
}

export function imageslist(data: any): IBaseRes<any> {
  return service({
    url: '/v1/image/draft_page',
    method: 'post',
    data: data,
  });
}

export function deleteImage(data: any): IBaseRes<any> {
  return service({
    url: '/v1/image/draft_delete',
    method: 'post',
    data: data,
  });
}

export function modellist(): IBaseRes<any> {
  return service({
    url: '/v1/model/types',
    method: 'get',
  });
}

export function resourceslist(): IBaseRes<any> {
  return service({
    url: '/v1/model/resources',
    method: 'get',
  });
}

export function imagepublish(data: any): IBaseRes<any> {
  return service({
    url: '/v1/image/draft_publish',
    method: 'post',
    data: data,
  });
}

export function imageRemoved(data: any): IBaseRes<any> {
  return service({
    url: '/v1/image/draft_off',
    method: 'post',
    data: data,
  });
}

export function taskDetail(id: any): IBaseRes<any> {
  return service({
    url: '/v1/image/queue_detail?id=' + id,
    method: 'post',
  });
}

export function ImageDetail(id: any): IBaseRes<any> {
  return service({
    url: '/v1/image/draft_detail?id=' + id,
    method: 'post',
  });
}

export function genModellist(data: any): IBaseRes<any> {
  return service({
    url: '/v1/model/gen_model_list',
    method: 'post',
    data: data,
  });
}

export function genResourceslist(data: any): IBaseRes<any> {
  return service({
    url: '/v1/model/gen_resources',
    method: 'post',
    data: data,
  });
}
