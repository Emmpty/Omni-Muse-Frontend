import { Loader, Center } from '@mantine/core';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import UserProfileLayout from '~/omnimuse-lib/features/user/UserProfileLayout';

const UserProfileEntry = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(`${router.asPath}/model`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Center p="xl" sx={{ height: '100%' }} mt="md">
      <Loader />
    </Center>
  );
};

setPageOptions(UserProfileEntry, { innerLayout: UserProfileLayout });
export default UserProfileEntry;
