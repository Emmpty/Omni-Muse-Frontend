import { triggerRoutedDialog } from '~/components/Dialog/RoutedDialogProvider';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import React, { useEffect, ReactNode } from 'react';
import { useModelStore } from '~/store/model.store';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';
interface CustomComponentProps {
  amount?: number | string;
  userId?: number | string;
  id: number | string;
  type: string;
  onCallBack?: (rewardCount: number) => void;
  children?: ReactNode;
}

const RewardButton: React.FC<CustomComponentProps> = ({
  amount = 10,
  userId,
  type,
  id,
  onCallBack,
  children,
}) => {
  const currentUser = useCurrentUser();
  const rewardCount = useModelStore((state) => state.rewardCount);

  useEffect(() => {
    if (onCallBack) {
      onCallBack(rewardCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardCount]);
  return (
    <>
      <LoginRedirect reason="reward">
        <div>
          {currentUser?.id != userId && (
            <div
              className="w-full"
              onClick={() => {
                triggerRoutedDialog({
                  name: 'reward',
                  state: { amount: amount, id: id, type: type },
                });
              }}
            >
              {children}
            </div>
          )}
        </div>
      </LoginRedirect>
    </>
  );
};

export default RewardButton;
