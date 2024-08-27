import React from 'react';
import { Avatar } from '@mantine/core';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: keyof typeof sizeConfigs;
  className?: string;
  children?: React.ReactNode;
}

const sizeConfigs = {
  xs: 22,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 44,
  xxl: 80,
};

const UserAvatar = ({ src = '', alt, size = 'sm', className, children }: UserAvatarProps) => {
  return (
    <Avatar
      className={`${className}`}
      radius={sizeConfigs[size] / 2}
      size={sizeConfigs[size]}
      src={src}
      alt={alt}
    >
      {children}
    </Avatar>
  );
};

export default UserAvatar;
