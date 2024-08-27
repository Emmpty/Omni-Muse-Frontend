import { useCallback } from 'react';
import { useUserLocalStore } from '~/store/local';
import { useUserStore } from '~/store/user.store';

export const useUserInfo = () => {
  const currentUser = useUserStore((state) => state.userInfo);
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const { setAllStoreUserInfo } = useUserLocalStore();
  const getIsOwner = useCallback(() => {
    return (id?: number) => {
      return id === currentUser?.id;
    };
  }, [currentUser?.id]);
  return {
    getIsOwner,
    currentUser,
    setUserInfo,
    setAllStoreUserInfo,
  };
};
