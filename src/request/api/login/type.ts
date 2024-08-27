import { TLoginType } from '~/request/api/user/type';

export interface GetEthSignDataReq {
  address: string;
}

export interface GetEthSignDataRes {
  expireAt: string;
  issuedAt: string;
  nonce: number;
  signData: string;
}

export interface EthSignInReq {
  signData: string;
  signature: string;
  loginType: TLoginType;
}

export interface EthSignInRes {
  token: string;
  userAddress: string;
}
