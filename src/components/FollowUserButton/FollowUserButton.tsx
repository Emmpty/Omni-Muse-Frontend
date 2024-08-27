import { Button, ButtonProps } from '@mantine/core';
import { useState, useEffect } from 'react';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';
import { followAdd, followRemove, getOtherUserInfo } from '~/request/api/user/index';
import { useUserStore } from '~/store/user.store';

export function FollowUserButton({ userId, onToggleFollow, ...buttonProps }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUser = useUserStore((state) => state.userInfo);

  useEffect(() => {
    getUserInfo();
  }, [userId]);

  const getUserInfo = async () => {
    try {
      const { code, result } = await getOtherUserInfo(userId);
      if (code === 200 && result) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowClick = async () => {
    setIsLoading(true);
    try {
      const res = isFollowing ? await followRemove(userId) : await followAdd(userId);
      if (res.code == 200) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (userId === currentUser?.id) return null;

  return (
    <LoginRedirect reason="follow-user">
      <Button
        className="text-white border-[1px] border-solid border-[#2B2D30] rounded-lg !bg-[rgba(43,45,48,0.5)]"
        radius="xl"
        variant={isFollowing ? 'outline' : 'light'}
        onClick={handleFollowClick}
        loading={isLoading}
        px="sm"
        sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}
        {...buttonProps}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </LoginRedirect>
  );
}

type Props = Omit<ButtonProps, 'onClick'> & {
  userId: number;
  onToggleFollow?: () => void;
};
