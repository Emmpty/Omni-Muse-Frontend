import { Loader } from '@mantine/core';
import React, { forwardRef, useMemo } from 'react';

export type XButtonType = keyof typeof typeConfigs;
export type XButtonSize = keyof typeof sizeConfigs;
interface XButtonProps {
  type?: XButtonType;
  size?: XButtonSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  innerClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const typeConfigs = {
  primary: 'bg-primaryBg hover:bg-[length:200%]',
  default: 'bg-secondaryBg border border-solid border-secondaryBorder',
  outline: 'bg-transparent border border-solid border-primaryBorder text-primaryText',
};

const sizeConfigs = {
  xs: '',
  sm: 'rounded-lg px-[14px] h-8 text-sm font-semibold',
  md: 'rounded-lg px-4 h-[44px] font-semibold text-base',
  lg: '',
  xl: '',
};

const loaderSizeConfigs = {
  xs: '',
  sm: 'h-4 w-4 mr-1',
  md: 'h-6 w-6 mr-1.5',
  lg: '',
  xl: '',
};

const _XButton = forwardRef<HTMLButtonElement, XButtonProps>(
  (
    {
      type = 'default',
      size = 'md',
      loading = false,
      disabled = false,
      className = '',
      innerClassName = '',
      onClick,
      children,
    },
    ref
  ) => {
    const disabledClass = useMemo(() => {
      return disabled ? 'opacity-60 cursor-not-allowed' : '';
    }, [disabled]);
    return (
      <button
        ref={ref}
        onClick={(e) => {
          if (disabled || loading) {
            return;
          }
          onClick?.(e);
        }}
        className={`x-button inline-flex font-sans items-center text-defaultText text-center ${typeConfigs[type]} ${sizeConfigs[size]} ${disabledClass} ${className}`}
      >
        {loading && (
          <div className={`${loaderSizeConfigs[size]}`}>
            <Loader width={'100%'} height={'100%'} color="#fefefe" />
          </div>
        )}
        <div className={`w-full ${innerClassName}`}>{children}</div>
      </button>
    );
  }
);

_XButton.displayName = 'XButton';

export default _XButton;
