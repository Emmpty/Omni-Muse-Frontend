import service, { IBaseRes } from '~/request/index';
import { EthSignInReq, EthSignInRes, GetEthSignDataReq, GetEthSignDataRes } from './type';
import Router from 'next/router';
import { useUserStore } from '~/store/user.store';

// 钱包地址获取签名信息
export const getEthSignData = (data: GetEthSignDataReq): IBaseRes<GetEthSignDataRes> => {
  return service({
    url: '/eth_signData',
    method: 'post',
    data,
  });
};

// 签名信息换token
export const ethSignIn = (data: EthSignInReq): IBaseRes<EthSignInRes> => {
  return service({
    url: '/eth_signIn',
    method: 'post',
    data: data,
  });
};

export const handleSignOut = () => {
  const clearUserInfo = useUserStore.getState().clearUserInfo;
  clearUserInfo();
  localStorage.clear();
  const url = `/login?returnUrl=${Router.asPath}`;
  window.location.href = url;
  if (url.includes('#')) window.location.reload();
};
