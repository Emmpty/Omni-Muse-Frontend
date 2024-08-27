import service, { IBaseRes } from '~/request';
import { RootObject, pageWorkParams, workAddParams, ResultList, bountyListParmas } from './type';
// 赏金列表
export function getBountiesList(data: bountyListParmas): IBaseRes<ResultList> {
  return service({
    url: '/v1/bounties/lists',
    method: 'post',
    data: data,
  });
}

// 赏金详情
export function getBountiesDetail(data: RootObject): IBaseRes<any> {
  return service({
    url: '/v1/bounties/detail',
    method: 'get',
    params: data,
  });
}

// 从个人中心点击进入赏金编辑
export function getBountiesDataDetail(data: RootObject): IBaseRes<any> {
  return service({
    url: '/v1/bounties/get',
    method: 'get',
    params: data,
  });
}

// 创建赏金
export function createdBounties(data: any): IBaseRes<any> {
  return service({
    url: '/v1/bounties/create',
    method: 'post',
    data: data,
  });
}

// 修改赏金
export function editBounties(data: any): IBaseRes<any> {
  return service({
    url: '/v1/bounties/edit',
    method: 'post',
    data: data,
  });
}

// 提交参赛作品
export function workAdd(data: workAddParams): IBaseRes<any> {
  return service({
    url: '/v1/user/bounty/work_add',
    method: 'post',
    data: data,
  });
}

// 采纳参赛作品
export function workAccept(data: RootObject): IBaseRes<any> {
  return service({
    url: '/v1/user/bounty/work_accept',
    method: 'post',
    data: data,
  });
}

// 查询参赛作品列表
export function workPage(data: pageWorkParams): IBaseRes<any> {
  return service({
    url: '/v1/user/bounty/work_page',
    method: 'post',
    data: data,
  });
}

// 查询参赛作品详情
export function workDetail(data: RootObject): IBaseRes<any> {
  return service({
    url: '/v1/user/bounty/work_detail',
    method: 'post',
    data: data,
  });
}

// 下载参赛作品
export function workDownload(data: RootObject): IBaseRes<any> {
  return service({
    url: '/v1/user/bounty/work_download',
    method: 'post',
    data: data,
  });
}
