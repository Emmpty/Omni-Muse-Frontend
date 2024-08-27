import service, { IBaseRes } from '~/request/index';
import {
  GetDownloadUrlReq,
  OperationModelReq,
  OtherUserInfo,
  SelfUserInfo,
  bountiesUserResult,
  dataSetsUserResult,
  operationParams,
  rewardParams,
  behavior
} from './type';

// 获取用户点赞或收藏
export const fetchUserLickAndCcollectModel = (data: OperationModelReq): IBaseRes<null> => {
  return service({
    url: `/v1/user/react/status`,
    method: 'get',
    params: data,
  });
};

// 点赞
export const likeModel = (data: OperationModelReq): IBaseRes<behavior> => {
  return service({
    url: `/v1/user/star`,
    method: 'post',
    data,
  });
};

// 收藏
export const collectModel = (data: OperationModelReq): IBaseRes<behavior> => {
  return service({
    url: `/v1/user/collect`,
    method: 'post',
    data,
  });
};

// 关注
export const followAdd = (id: number): IBaseRes<null> => {
  return service({
    url: `/v1/user/follow_add`,
    method: 'post',
    data: { id },
  });
};

// 取消关注
export const followRemove = (id: number): IBaseRes<null> => {
  return service({
    url: `/v1/user/follow_remove`,
    method: 'post',
    data: { id },
  });
};

// 获取下载链接
export const getDownloadUrl = (
  data: GetDownloadUrlReq
): IBaseRes<{
  urls: any;
  cid: string;
  url: string;
  name: string;
}> => {
  return service({
    url: `/v1/user/download_url`,
    method: 'post',
    data,
  });
};

// 修改昵称
export const editUserName = (name: string): IBaseRes<null> => {
  return service({
    url: `/v1/user/update_nick`,
    method: 'post',
    data: { name },
  });
};

// 修改头像
export const uploadAvatar = (file: File): IBaseRes<null> => {
  const formData = new FormData();
  formData.append('file', file); // 'file' 是后端期望的字段名

  return service({
    url: `/v1/user/upload_avatar`,
    method: 'post',
    data: formData,
    headers: {
      // 此处不设置 Content-Type，让 Axios 自动设置
      'Content-Type': undefined,
    },
  });
};

// 获取其他用户信息
export const getOtherUserInfo = (id: number): IBaseRes<OtherUserInfo> => {
  return service({
    url: `/v1/user_get`,
    method: 'post',
    data: { id },
  });
};

// 获取用户自身信息
export const getUserInfo = (): IBaseRes<SelfUserInfo> => {
  return service({
    url: `/v1/user/info`,
    method: 'get',
  });
};

export const getUserLikes = (data: any): IBaseRes<SelfUserInfo> => {
  return service({
    url: `/v1/user/likes`,
    method: 'post',
    data,
  });
};

export const getUserCollects = (data: any): IBaseRes<SelfUserInfo> => {
  return service({
    url: `/v1/user/collects`,
    method: 'post',
    data,
  });
};

// 个人中心数据集列表
export const getUserDataSets = (data: operationParams): IBaseRes<dataSetsUserResult> => {
  return service({
    url: `/v1/user/datasets`,
    method: 'post',
    data,
  });
};
// 个人中心赏金列表
export const getBountiesList = (data: operationParams): IBaseRes<bountiesUserResult> => {
  return service({
    url: `/v1/user/bounties`,
    method: 'post',
    data,
  });
};

// 用户打赏
export const userReward = (data: rewardParams): IBaseRes<any> => {
  return service({
    url: `/v1/user/reward`,
    method: 'post',
    data,
  });
};
