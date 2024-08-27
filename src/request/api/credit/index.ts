import service, { IBaseRes } from '~/request/index';
import { CreditType, ICreditPackage, ICreditRecord, RechargeCreditsReq } from './type';

// 获取积分套餐
export function getPackages(): IBaseRes<ICreditPackage[]> {
  return service({
    url: '/v1/credits/getPackages',
    method: 'post',
  });
}

// 获取用户积分记录
export function getCreditRecords(type: CreditType[]): IBaseRes<ICreditRecord[]> {
  return service({
    url: '/v1/credits/getCreditRecords',
    method: 'post',
    data: { type },
  });
}

// 获取emc转为usdt的单价
export function getEmcUsdtPrice(): IBaseRes<number> {
  return service({
    url: '/v1/credits/getEmcUsdtPrice',
    method: 'post',
  });
}

// 充值积分
export function rechargeCredits(data: RechargeCreditsReq): IBaseRes<number> {
  return service({
    url: '/v1/credits/save',
    method: 'post',
    data,
  });
}
