import { TablerIconsProps } from '@tabler/icons-react';
import React, { forwardRef } from 'react';
interface XIconButtonProps {
  icon: (props: TablerIconsProps) => JSX.Element;
  type?: keyof typeof typeConfigs;
  size?: keyof typeof sizeConfigs;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const typeConfigs = {
  default: 'bg-secondaryBg border border-solid border-secondaryBorder',
};

const sizeConfigs = {
  xs: {
    box: '',
    iconSize: 0,
  },
  sm: {
    box: 'rounded-[8px] p-2 h-8',
    iconSize: 16,
  },
  md: {
    box: 'rounded-lg p-2.5 h-[44px]',
    iconSize: 24,
  },
  lg: {
    box: '',
    iconSize: 0,
  },
  xl: {
    box: '',
    iconSize: 0,
  },
};

const _XIconButton = forwardRef<HTMLButtonElement, XIconButtonProps>(
  ({ type = 'default', size = 'md', className = '', onClick, icon, children }, ref) => {
    return (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
        }}
        className={`inline-flex items-center text-defaultText ${typeConfigs[type]} ${sizeConfigs[size].box} ${className}`}
      >
        {React.createElement(icon, { size: sizeConfigs[size].iconSize })}
        {children}
      </button>
    );
  }
);

_XIconButton.displayName = 'XIconButton';

export default _XIconButton;
