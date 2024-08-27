import { Modal, ModalProps, ScrollArea } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useMemo } from 'react';

interface MantineModalProps extends ModalProps {
  titleClassName?: string;
  closeClassName?: string;
  width?: number;
  maxHeight?: string | number;
  showHeaderLine?: boolean;
}

export default function MantineModal({
  titleClassName = '',
  closeClassName = '',
  width = 0,
  maxHeight,
  showHeaderLine = true,
  ...props
}: MantineModalProps) {
  const lineClass = useMemo(() => {
    return showHeaderLine ? 'border-b border-solid border-secondaryBorder' : '';
  }, [showHeaderLine]);
  return (
    <Modal
      centered={true}
      {...props}
      styles={(theme) => ({
        modal: {
          maxWidth: '100%',
          width: `${width ? width + 'px !important' : 'auto'}`,
          color: theme.colors.omnimuse[4],
          backgroundColor: theme.colors.omnimuse[9],
          borderRadius: 12,
          padding: '0px !important',
        },
      })}
      title=""
      withCloseButton={false}
    >
      <div className={`flex justify-between p-5 ${lineClass}`}>
        <span className={`text-defaultText text-base font-semibold ${titleClassName}`}>
          {props.title}
        </span>
        <span
          onClick={props?.onClose}
          className={`text-secondaryText cursor-pointer ${closeClassName}`}
        >
          <IconX size={20} />
        </span>
      </div>
      <ScrollArea.Autosize maxHeight={maxHeight} mx="auto">
        {props.children}
      </ScrollArea.Autosize>
    </Modal>
  );
}
