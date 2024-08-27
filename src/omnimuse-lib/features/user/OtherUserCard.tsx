import { IconUser } from '@tabler/icons-react';
import XButton from '~/omnimuse-lib/components/XButton';
import UserAvatar from '~/omnimuse-lib/features/user/UserAvatar';
import React, { useEffect, useState } from 'react';
import { formatDate } from '~/utils/date-helpers';
import { useRouter } from 'next/router';
import { abbreviateNumber } from '~/utils/number-helpers';
import { followAdd, followRemove, getOtherUserInfo } from '~/request/api/user/index';
import { OtherUserInfo } from '~/request/api/user/type';
import { useCommonStore } from '~/store/common.store';

interface UserCardProps {
  userId: number;
  link?: string;
}

const OtherUserCard = ({ userId, link }: UserCardProps) => {
  const router = useRouter();
  const refreshOtherUserInfoKey = useCommonStore((state) => state.refreshOtherUserInfoKey);
  const [user, setUser] = useState<OtherUserInfo | null>(null);
  const handleFollowed = async () => {
    const res = user?.isFollow ? await followRemove(userId) : await followAdd(userId);
    if (res.code === 200) {
      await getUserInfo();
    }
  };
  const getUserInfo = async () => {
    const res = await getOtherUserInfo(userId);
    if (res.code === 200) {
      setUser(res.result);
    }
  };
  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refreshOtherUserInfoKey]);
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
    <div className="border rounded-lg border-solid border-secondaryBorder bg-secondaryBg text-defaultText">
      <div className="h-16 flex items-center px-5 gap-2">
        <IconUser size={24} />
        <span className="capitalize font-semibold text-base">author</span>
      </div>
      <div className="flex flex-wrap justify-between py-6 pl-5 pr-[14px] border-y border-solid border-secondaryBorder">
        <div
          onClick={() => {
            router.push(`${link ? `/user/${userId}/${link}` : `/user/${userId}`}`);
          }}
          className="flex items-center gap-2.5 cursor-pointer w-[70%]"
        >
          <UserAvatar size="xl" src={user.image || ''} />
          <div className="max-w-32 w-[60%]">
            <p className="text-base font-semibold mb-0.5 overflow-hidden overflow-ellipsis whitespace-nowrap">
              {user.username}
            </p>
            <p className="text-xs text-secondaryText">Joined {formatDate(user.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {/* <XButton size="sm">Chat</XButton> */}
          <XButton
            onClick={() => {
              handleFollowed();
            }}
            size="sm"
          >
            {user.isFollow ? 'Unfollow' : 'Follow'}
          </XButton>
        </div>
      </div>
      <div className="h-[90px] flex items-center px-5 gap-2.5">
        {items.map((item) => {
          return (
            <div key={item.label} className="flex-1 flex flex-col gap-1">
              <span className="font-semibold text-lg text-defaultText">{item.value}</span>
              <span className="font-normal text-xs text-secondaryText">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OtherUserCard;
