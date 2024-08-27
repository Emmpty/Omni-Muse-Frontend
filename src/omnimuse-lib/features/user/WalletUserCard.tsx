import React from 'react';
import UserAvatar from '~/omnimuse-lib/features/user/UserAvatar';
import { IconCopy } from '@tabler/icons-react';
import copy from '~/utils/omnimuse/copy';
import { formatAddress } from '~/utils/omnimuse/format';
import { useUserStore } from '~/store/user.store';

const WalletUserCard = () => {
  const currentUser = useUserStore((state) => state.userInfo);
  return (
    <div className="flex gap-3 items-center">
      <UserAvatar src={currentUser?.image || ''} size="md" />
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-semibold text-defaultText">
          {formatAddress(currentUser?.address)}
        </span>
        <div
          className="flex items-center cursor-pointer gap-1"
          onClick={() => copy(currentUser?.address)}
        >
          <span title="click to copy wallet address" className="text-xs text-secondaryText">
            {formatAddress(currentUser?.address)}
          </span>
          <IconCopy size={12} />
        </div>
      </div>
    </div>
  );
};

export default WalletUserCard;
