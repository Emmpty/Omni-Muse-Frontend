import React, { useState, useEffect, useMemo } from 'react';
import {
  IconTrophy,
  IconCategory,
  IconFileDescription,
  IconHeart,
  IconCircleDot,
  IconPhotoScan,
  IconStar,
  TablerIconsProps,
} from '@tabler/icons-react';
import XTabMenu, { XTabItem } from '~/omnimuse-lib/components/XTabMenu';
import { useRouter } from 'next/router';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';
import { getOtherUserInfo } from '~/request/api/user';

const UserSubMenu = () => {
  const { getIsOwner, currentUser } = useUserInfo();
  const router = useRouter();
  const [activeKey, setActiveKey] = useState('model');
  const [user, setUser] = useState(null);
  const [key, setKey] = useState(1);

  const username = useMemo(() => {
    return Number(router.query?.username) || 1;
  }, [router.query?.username]);

  const handleGetOtherUserInfo = async () => {
    try {
      const res = await getOtherUserInfo(username);
      if (res.code === 200) {
        setUser(res.result);
        setKey((prev) => prev + 1); // Increment key to trigger re-render
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  useEffect(() => {
    const getOwner = getIsOwner();
    const isOwner = getOwner(Number(router.query?.username));
    if (isOwner) {
      setUser(currentUser);
    } else {
      handleGetOtherUserInfo();
    }
    setKey((prev) => prev + 1); // Ensure re-render when user info changes
  }, [getIsOwner, router.query?.username, currentUser]);

  const tabItems = useMemo(
    () => [
      {
        label: 'Model',
        url: `/user/${username}/model`,
        key: 'model',
        icon: (props) => <IconCategory {...props} />,
      },
      {
        label: 'Image',
        url: `/user/${username}/image`,
        key: 'image',
        icon: (props) => <IconPhotoScan {...props} />,
      },
      {
        label: 'Data Set',
        url: `/user/${username}/dataSet`,
        key: 'dataSet',
        icon: (props) => <IconFileDescription {...props} />,
      },
      {
        label: 'Bounties',
        url: `/user/${username}/bounties`,
        key: 'bounties',
        icon: (props) => <IconCircleDot {...props} />,
      },
      {
        label: 'Events',
        url: `/user/${username}/events`,
        key: 'events',
        hide: !user?.isSystem,
        icon: (props) => <IconTrophy {...props} />,
      },
      {
        label: 'Likes',
        url: `/user/${username}/likes`,
        key: 'likes',
        icon: (props) => <IconHeart {...props} />,
      },
      {
        label: 'Collect',
        url: `/user/${username}/collect`,
        key: 'collect',
        icon: (props) => <IconStar {...props} />,
      },
    ],
    [key, user?.isSystem, username]
  );

  useEffect(() => {
    const parts = router?.asPath.split('/');
    const pathKey = parts[3]?.includes('?') ? parts[3].split('?')[0] : parts[3];
    setActiveKey(pathKey);
  }, [router.asPath]);

  return (
    <XTabMenu
      className="mt-1"
      tabItems={tabItems}
      activeKey={activeKey}
      onClick={(item) => setActiveKey(item.key)}
    />
  );
};

export default UserSubMenu;
