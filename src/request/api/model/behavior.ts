import service, { IBaseRes } from '~/request/index';
import { GetModelStartsAndCollectsRes, GetModelOperationCountsRes } from './type';

// 获取模型中已经点赞和收藏的版本id集合
export const getModelStarsAndCollects = (
  modelId: number
): IBaseRes<GetModelStartsAndCollectsRes> => {
  return service({
    url: `/v1/models/user/operation/${modelId}`,
    method: 'get',
  });
};

// 获取模型操作的一些统计数量，如点赞、收藏、下载等
export const getModelOperationCounts = (modelId: number): IBaseRes<GetModelOperationCountsRes> => {
  return service({
    url: `v1/models/react/${modelId}`,
    method: 'get',
  });
};

// 提交模型申诉
export const appealModalSubmit = (data: any): IBaseRes<any> => {
  return service({
    url: `v1/user/user_model_appeal`,
    method: 'post',
    data,
  });
};
