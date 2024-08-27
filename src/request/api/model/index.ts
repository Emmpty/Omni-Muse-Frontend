import service, { IBaseRes } from '~/request/index';
import { IModel, TAppealStatus } from './type';

export function buyModel(data: any): IBaseRes<any> {
  return service({
    url: '/v1/model/purchase',
    method: 'post',
    data: data,
  });
}

export function uploadModel(data: any): IBaseRes<any> {
  return service({
    url: '/v1/upload_model',
    method: 'post',
    data: data,
  });
}

export const getModelEditInfo = (id: number): IBaseRes<IModel> => {
  return service({
    url: `/v1/model/edit/${id}`,
    method: 'get',
  });
};

export const getModelDetailById = (id: number, status?: TAppealStatus): IBaseRes<IModel> => {
  return service({
    url: status ? `/v1/models/${id}?status=${status}` : `/v1/models/${id}`,
    method: 'get',
  });
};

export const modellist = ({ tags, ...data }: any): IBaseRes<any> => {
  return service({
    url: `/v1/models?tags=${tags || ''}`,
    method: 'post',
    data: {
      ...data,
      pageSize: 30,
    },
  });
};

export const getModelGalleryList = (id: number): IBaseRes<any> => {
  return service({
    url: `/v1/model/images/${id}`,
    method: 'get',
  });
};

export const fetchGalleDetailsByPostId = (id: number | string): IBaseRes<any> => {
  return service({
    url: `/v1/model/images/detail/${id}`,
    method: 'get',
  });
};

export const fetchGalleDetailsByImageId = (id: number | string): IBaseRes<any> => {
  return service({
    url: `/v1/user/image/detail/${id}`,
    method: 'get',
  });
};

export const vaelist = (data: any = {}): IBaseRes<any> => {
  return service({
    url: '/v1/image/vae_list',
    method: 'post',
    data,
  });
};

export const getInfoByVersionId = (id: any): IBaseRes<any> => {
  return service({
    url: `/v1/model/version_info?id=${id}`,
    method: 'get',
  });
};

export function getUserModels(data: any): IBaseRes<any> {
  return service({
    url: '/v1/user/models',
    method: 'post',
    data: data,
  });
}

export function getModelImages(id: number): IBaseRes<string[]> {
  return service({
    url: `/v1/models/exmaple_img/${id}`,
    method: 'get',
  });
}
