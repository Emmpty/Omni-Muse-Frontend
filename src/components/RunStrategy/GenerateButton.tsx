import { ButtonProps, Text, Tooltip } from '@mantine/core';
import XButton, { XButtonType } from '~/omnimuse-lib/components/XButton';
import { IconBrush } from '@tabler/icons-react';
import React from 'react';
import { useGenerationnnnnStore } from '~/store/generationnnnn.store';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';
export function GenerateButton({
  iconOnly,
  modelVersionId,
  taskId,
  imageId,
  buttonType = 'primary',
  btnTextIconProps = {},
  children,
  ...buttonProps
}: Props) {
  const { opened, open, close, setModelVersionId, setTaskId, setImageId } =
    useGenerationnnnnStore();

  const onClickHandler = () => {
    if (opened) return close();
    modelVersionId && setModelVersionId(modelVersionId);
    taskId && setTaskId(taskId);
    imageId && setImageId(imageId);
    open();
  };

  if (children)
    return React.cloneElement(children, {
      ...buttonProps,
      onClick: onClickHandler,
      style: { cursor: 'pointer' },
    });

  const button = (
    <LoginRedirect reason="add-to-collection">
      <XButton
        className="flex-1"
        innerClassName="w-full flex items-center justify-center gap-1"
        onClick={onClickHandler}
        {...buttonProps}
        type={buttonType}
      >
        {iconOnly ? (
          <IconBrush size={24} />
        ) : (
          <>
            <IconBrush size={btnTextIconProps.IconSize || 22} />
            <Text
              inherit
              inline
              className={`hide-mobile text-base font-semibold ${btnTextIconProps.className}`}
            >
              {btnTextIconProps.btnText || 'Create'}
            </Text>
          </>
        )}
      </XButton>
    </LoginRedirect>
  );

  return iconOnly ? (
    <Tooltip label="Start Generating" withArrow>
      {button}
    </Tooltip>
  ) : (
    button
  );
}

type Props = Omit<ButtonProps, 'onClick' | 'children'> & {
  iconOnly?: boolean;
  modelVersionId?: number;
  taskId?: number | string;
  imageId?: string;
  buttonType?: XButtonType;
  btnTextIconProps?: {
    btnText?: string;
    IconSize?: number;
    className?: string;
  };
  children?: React.ReactElement;
};
