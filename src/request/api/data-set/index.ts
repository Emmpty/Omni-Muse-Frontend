import service, { IBaseRes } from '~/request';
import { ResultEdit, SubmitDataSetParams } from './type';
// 获取数据集列表
export function getDataSetList(data: any): IBaseRes<any> {
  return service({
    url: '/v1/dataset/lists',
    method: 'post',
    data: data,
  });
}

// 添加数据集
export function datasetUpload(data: any): IBaseRes<any> {
  return service({
    url: '/v1/dataset/upload',
    method: 'post',
    data: data,
  });
}
// 修改数据集
export function dataSetEdit(data: any): IBaseRes<any> {
  return service({
    url: '/v1/dataset/edit',
    method: 'post',
    data: data,
  });
}

// 获取数据集详情
export function getDatasetDetail(data: any): IBaseRes<ResultEdit> {
  return service({
    url: '/v1/dataset/detail',
    method: 'GET',
    params: data,
  });
}
// 从个人中心点击获取编辑数据集数据
export function getDatasetDataDetail(data: any): IBaseRes<ResultEdit> {
  return service({
    url: '/v1/dataset/get',
    method: 'GET',
    params: data,
  });
}
