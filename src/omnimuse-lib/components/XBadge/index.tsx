import React, { useMemo } from 'react';
interface XBadgeProps {
  type?: keyof typeof typeConfigs;
  size?: keyof typeof sizeConfigs;
  isActive?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const typeConfigs = {
  tag: '',
  version: '',
};

const sizeConfigs = {
  xs: '',
  sm: 'px-2 h-6 rounded-[33px] text-xs',
  md: 'px-2.5 h-9 rounded-lg text-base',
  lg: '',
  xl: '',
};

const XBadge = ({
  type = 'tag',
  size = 'md',
  isActive = false,
  className = '',
  onClick,
  children,
}: XBadgeProps) => {
  const activeClass = useMemo(() => {
    if (size === 'md' && !isActive) {
      return 'bg-secondaryBg text-secondaryText';
    }
    return isActive
      ? 'border border-solid border-primaryBorder bg-badgeBg text-defaultText'
      : 'border border-solid border-secondaryBorder bg-secondaryBg text-secondaryText';
  }, [isActive, size]);
  return (
    <div
      onClick={(e) => {
        onClick?.(e);
      }}
      className={`flex items-center justify-center text-center cursor-pointer ${typeConfigs[type]} ${sizeConfigs[size]} ${activeClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default XBadge;
