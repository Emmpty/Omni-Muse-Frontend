import { ethSignIn, getEthSignData } from '~/request/api/login';
import { getUserInfo } from '~/request/api/user';
import { TLoginType } from '~/request/api/user/type';
import { TUserProps, loginFlags, loginUserInfo } from '~/store/user.store';
import { FeatureAccess } from '~/types/flags';

export const handleGetEthSignData = async (address: string) => {
  let resultData = {
    nonce: 0,
    signData: '',
    flag: false,
  };
  const data = await getEthSignData({ address });
  const { code, result } = data;
  if (code === 200) {
    const { nonce, signData } = result;
    resultData = {
      flag: true,
      nonce,
      signData,
    };
  }
  return resultData;
};

export const handleLoginSuccess = (url: string) => {
  window.location.href = url;
  // If url contains a hash, the browser does not reload the page. We reload manually
  if (url.includes('#')) window.location.reload();
  return;
};

interface HandleEthSignInRes {
  flag: boolean;
  userInfo: null | TUserProps;
  loginFlags: FeatureAccess;
}

export const handleEthSignIn = async (
  signData: string,
  signature: string,
  loginType: TLoginType
) => {
  let resultData: HandleEthSignInRes = {
    flag: false,
    userInfo: null,
    loginFlags,
  };
  const signInRes = await ethSignIn({
    signData,
    signature,
    loginType,
  });

  const { code, result } = signInRes;
  if (code === 200) {
    // console.log('result: ', result);
    const { token } = result;
    localStorage.setItem('token', token);
    const userRes = await getUserInfo();
    if (userRes.code === 200) {
      const userInfo: TUserProps = {
        ...loginUserInfo,
        token,
        ...userRes.result,
        image:
          userRes.result.image ||
          'https://app.omnimuse.ai/ipfs/QmQqVdnqGn4nGSqHf15mwAVQKeH2Ym6WzxyvBLKf9K6qS3',
      };

      resultData = {
        flag: true,
        userInfo,
        loginFlags,
      };
    }
  }

  return resultData;
};
