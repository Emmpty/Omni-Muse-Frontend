import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Tooltip } from '@mantine/core';
import XIconButton from '~/omnimuse-lib/components/XButton/XIconButton';
import { ShareButton } from '~/components/ShareButton/ShareButton';
import XButton from '~/omnimuse-lib/components/XButton';
import { IconEdit, IconShare3, TablerIconsProps } from '@tabler/icons-react';
import UserAvatar from '~/omnimuse-lib/features/user/UserAvatar';
import { TUserProps } from '~/store/user.store';
import { abbreviateNumber } from '~/utils/number-helpers';
import { formatDate } from '~/utils/date-helpers';
import { followAdd, followRemove, getOtherUserInfo } from '~/request/api/user';
import { OtherUserInfo } from '~/request/api/user/type';
import { triggerRoutedDialog } from '~/components/Dialog/RoutedDialogProvider';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';

const UserLeftSider = () => {
  const router = useRouter();
  const { getIsOwner, currentUser } = useUserInfo();
  const [user, setUser] = useState<TUserProps | OtherUserInfo | null>(null);

  const isMaster = useMemo(() => {
    const getOwner = getIsOwner();
    return getOwner(Number(router.query?.username));
  }, [getIsOwner, router.query?.username]);

  const userId = useMemo(() => {
    return Number(router.query?.username);
  }, [router.query?.username]);

  const handleGetOtherUserInfo = async () => {
    const res = await getOtherUserInfo(userId);
    if (res.code === 200) {
      setUser(res.result);
    }
  };

  const handleFollowed = async () => {
    const res = user?.isFollow ? await followRemove(userId) : await followAdd(userId);
    if (res.code === 200) {
      await handleGetOtherUserInfo();
    }
  };

  useEffect(() => {
    if (isMaster) {
      setUser(currentUser);
    } else {
      handleGetOtherUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaster, currentUser, router.query?.username]);

  if (!user) {
    return null;
  }

  const items = [
    {
      label: 'Likes',
      value: abbreviateNumber(user.likes),
    },
    {
      label: 'Followers',
      value: abbreviateNumber(user.followerCount),
    },
    {
      label: 'Fans',
      value: abbreviateNumber(user.fansCount),
    },
    {
      label: 'Downloads',
      value: abbreviateNumber(user.downloads),
    },
  ];
  return (
    <>
      <div className="min-w-[400px] w-[400px] h-full bg-defaultBg border-r border-solid border-headerBorder">
        <div className="flex justify-end items-center pt-5 px-5">
          <Tooltip label="Share" position="top" withArrow>
            <div>
              <ShareButton url={router.asPath} title={'user profile'}>
                <XIconButton
                  size="sm"
                  icon={(props: TablerIconsProps) => <IconShare3 {...props} />}
                ></XIconButton>
              </ShareButton>
            </div>
          </Tooltip>
        </div>
        <div className="flex flex-col justify-center items-center px-5">
          {user.image && <UserAvatar className="mt-7 mb-5" size="xxl" src={user.image} />}
          <span className="font-semibold text-xl text-defaultText truncate max-w-[80%]">
            {user.username}
          </span>
          <span className="font-normal text-xs text-secondaryText mb-8">
            Joined {formatDate(user.createdAt)}
          </span>
          {isMaster && (
            <XButton
              onClick={() => {
                triggerRoutedDialog({ name: 'editUserProfileModal', state: {} });
              }}
              className="w-full mb-10"
              innerClassName="flex items-center justify-center gap-2"
            >
              <>
                <IconEdit size={22} stroke={2} />
                <span>Edit profile</span>
              </>
            </XButton>
          )}
        </div>
        <div className="py-7 px-5 mb-8 flex flex-wrap gap-3 border-t border-b border-solid border-divideBorder">
          {items.map((item) => {
            return (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-semibold text-lg text-defaultText">{item.value}</span>
                <span className="font-normal text-xs text-secondaryText">{item.label}</span>
              </div>
            );
          })}
        </div>
        {!isMaster && (
          <div className="flex flex-col items-center gap-5 px-5">
            <XButton
              onClick={() => {
                handleFollowed();
              }}
              className="w-full"
              type="primary"
            >
              {user.isFollow ? 'Unfollow' : 'Follow'}
            </XButton>
            <XButton
              className="w-full"
              onClick={() => {
                triggerRoutedDialog({
                  name: 'reward',
                  state: { amount: 10, id: user.id, type: 'user' },
                });
              }}
            >
              Reward
            </XButton>
            {/* <XButton className="w-full">Chat</XButton> */}
          </div>
        )}
      </div>
    </>
  );
};

export default UserLeftSider;
