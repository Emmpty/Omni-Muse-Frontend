import { TUserProps, useUserStore } from '~/store/user.store';

export const useUserLocalStore = () => {
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const userInfo = useUserStore((state) => state.userInfo);

  const setAllStoreUserInfo = (data: Partial<TUserProps>) => {
    const info = { ...userInfo, ...data };
    setUserInfo(info);
    localStorage.setItem('userInfo', JSON.stringify(info));
  };

  return {
    setAllStoreUserInfo,
  };
};
