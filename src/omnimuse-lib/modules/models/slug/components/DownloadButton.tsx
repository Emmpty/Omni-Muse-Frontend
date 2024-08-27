import { Tooltip, createPolymorphicComponent } from '@mantine/core';
import XIconButton from '~/omnimuse-lib/components/XButton/XIconButton';
import { IconDownload, TablerIconsProps } from '@tabler/icons-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const _DownloadButton = forwardRef<HTMLButtonElement, Props>(
  ({ iconOnly, canDownload, downloadRequiresPurchase, ...buttonProps }, ref) => {
    return (
      <Tooltip label="Download options" withArrow>
        {/* @ts-ignore */}
        <XIconButton
          ref={ref}
          icon={(props: TablerIconsProps) => <IconDownload {...props} />}
          className="relative"
          {...buttonProps}
        ></XIconButton>
      </Tooltip>
    );
  }
);
_DownloadButton.displayName = 'DownloadButton';

type Props = ButtonHTMLAttributes<any> & {
  iconOnly?: boolean;
  canDownload?: boolean;
  downloadRequiresPurchase?: boolean;
  modelVersionId?: number;
};

export const DownloadButton = createPolymorphicComponent<'button', Props>(_DownloadButton);
