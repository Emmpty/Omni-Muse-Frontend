import React from 'react';
import UserLeftSider from '~/omnimuse-lib/features/user/UserLeftSider';
import UserSubMenu from '~/omnimuse-lib/features/user/UserSubMenu';

const UserProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full h-full">
      <UserLeftSider />
      <div className="flex-1 flex flex-col">
        <UserSubMenu />
        {children}
      </div>
    </div>
  );
};

export default UserProfileLayout;
