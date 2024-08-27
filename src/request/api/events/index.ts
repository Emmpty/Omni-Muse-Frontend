import service, { IBaseRes } from '~/request';

// 赛事列表
export function getEventsList(data: any): IBaseRes<any> {
  return service({
    url: '/v1/event/race_page',
    method: 'post',
    data: data,
  });
}
// 管理员赛事列表
export function getAdminEventsList(data: any): IBaseRes<any> {
  return service({
    url: '/v1/admin_event/race_page',
    method: 'post',
    data: data,
  });
}

// 赛事详情
export function getEventsDetail(data: any): IBaseRes<any> {
  return service({
    url: '/v1/event/race_detail',
    method: 'post',
    data: data,
  });
}
// 创建赛事
export function createdEvents(data: any): IBaseRes<any> {
  return service({
    url: '/v1/admin_event/race_create',
    method: 'post',
    data: data,
  });
}

// 编辑赛事
export function saveEvents(data: any): IBaseRes<any> {
  return service({
    url: '/v1/admin_event/race_save',
    method: 'post',
    data: data,
  });
}
