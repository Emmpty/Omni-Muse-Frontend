import { TablerIconsProps } from '@tabler/icons-react';
import Link from 'next/link';
import React, { CSSProperties, useEffect, useState } from 'react';
export interface XTabMenuProps {
  tabItems: XTabItem[];
  activeKey: string;
  size?: keyof typeof sizeConfigs;
  className?: string;
  onClick?: (item: XTabItem) => void;
}

export interface XTabItem {
  label: string;
  url: string;
  key: string;
  hide?: boolean;
  icon: (props: TablerIconsProps) => JSX.Element;
}

const sizeConfigs = {
  xs: {
    menu: '',
    line: '',
    labelBox: '',
    icon: {
      size: 20,
      stroke: 2,
    },
    label: '',
  },
  sm: {
    menu: '',
    line: '',
    labelBox: '',
    icon: {
      size: 20,
      stroke: 2,
    },
    label: '',
  },
  md: {
    menu: 'h-[60px] gap-9 text-sm font-semibold',
    line: 'h-[3px] bg-primaryBg shadow-primaryShadow rounded-t-lg',
    labelBox: 'gap-2 px-2 py-5 rounded-lg',
    icon: {
      size: 20,
      stroke: 2,
    },
    label: 'font-semibold',
  },
  lg: {
    menu: '',
    line: '',
    labelBox: '',
    icon: {
      size: 20,
      stroke: 2,
    },
    label: '',
  },
  xl: {
    menu: '',
    line: '',
    labelBox: '',
    icon: {
      size: 20,
      stroke: 2,
    },
    label: '',
  },
};

const XTabMenu = ({
  tabItems = [],
  activeKey,
  size = 'md',
  className = '',
  onClick,
}: XTabMenuProps) => {
  const [lineStyle, setLineStyle] = useState<CSSProperties | null>(null);
  useEffect(() => {
    if (activeKey) {
      const activeRef = document.getElementById(`active_${activeKey}`);
      const width = activeRef?.clientWidth || 0;
      const left = activeRef?.offsetLeft || 0;
      const result: CSSProperties = {
        display: 'block',
        position: 'absolute',
        bottom: '0px',
        left: `${left}px`,
        width: `${width}px`,
      };
      setLineStyle(result);
    }
  }, [activeKey]);
  return (
    <div className="relative bg-defaultBg">
      <div
        className={`main-tab flex items-center text-secondaryText px-8 ${sizeConfigs[size].menu} ${className}`}
      >
        {tabItems.map((item) => {
          const activeFlag = activeKey === item.key
          return (
            !item.hide && (
              <Link key={item.key} href={item.url} passHref>
                <div
                  onClick={() => {
                    onClick?.(item);
                  }}
                  id={activeFlag ? `active_${item.key}` : ''}
                  className={`flex items-center justify-center hover:bg-secondaryHoverBg cursor-pointer ${
                    sizeConfigs[size].labelBox
                  } ${activeFlag ? 'text-defaultText' : ''}`}
                >
                  {React.createElement(item.icon, { ...sizeConfigs[size].icon })}
                  <span className={`capitalize ${sizeConfigs[size].label}`}>{item.label}</span>
                </div>
              </Link>
            )
          );
        })}
      </div>
      <div style={lineStyle || {}} className={`hidden active-line ${sizeConfigs[size].line}`}></div>
    </div>
  );
};

export default XTabMenu;
