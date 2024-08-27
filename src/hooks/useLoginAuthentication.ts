import { useUserStore } from '~/store/user.store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useLoginAuthentication = (reverse?: boolean) => {
  const userInfo = useUserStore((state) => state.userInfo);
  const router = useRouter();
  const [initFlag, setInitFlag] = useState(false);

  const handleAwaitPush = async (fullPath: string) => {
    await router.push(`/login?returnUrl=${fullPath}`);
    setInitFlag(true);
    // setTimeout(() => {
    //   setInitFlag(true);
    // }, 300);
  };

  const handleAwaitBack = async () => {
    await router.back();
    setInitFlag(true);
    // setTimeout(() => {
    //   setInitFlag(true);
    // }, 300);
  };
  useEffect(() => {
    const fullPath = encodeURIComponent(router.asPath);
    const localUserInfo = localStorage.getItem('userInfo');
    if (reverse && (userInfo || localUserInfo)) {
      handleAwaitBack();
    } else if (!reverse && !userInfo && !localUserInfo) {
      handleAwaitPush(fullPath);
    } else {
      setInitFlag(true);
    }
  }, [router, userInfo, reverse]);

  return {
    initFlag,
  };
};
