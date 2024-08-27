import { Group, Popover, Stack, Text } from '@mantine/core';
import React from 'react';
import { QS } from '~/utils/qs';
import { SocialIconCopy } from '~/components/ShareButton/Icons/SocialIconCopy';
import { useTrackEvent } from '../TrackView/track.utils';
import { IconBrandX } from '@tabler/icons-react';
import copy from '~/utils/omnimuse/copy';

export function ShareButton({
  children,
  url: initialUrl,
  title,
  dropdownClassProp = '!bg-[#161718] border-0 rounded-lg',
}: {
  children: React.ReactElement;
  url?: string;
  title?: string;
  collect?: any;
  dropdownClassProp?: string;
}) {
  const { trackShare } = useTrackEvent();

  const url =
    typeof window === 'undefined'
      ? ''
      : !initialUrl
      ? location.href
      : `${location.protocol}//${location.host}${initialUrl}`;

  const shareLinks = [
    {
      type: 'Copy Link',
      onClick: () => {
        trackShare({ platform: 'clipboard', url });
        copy(url);
      },
      render: <SocialIconCopy copied={false} />,
    },
    {
      type: 'Share on Twitter',
      onClick: () => {
        trackShare({ platform: 'twitter', url });
        window.open(
          `https://twitter.com/intent/tweet?${QS.stringify({
            url,
            text: title,
            via: 'HelloCivitai',
          })}`
        );
      },
      render: <IconBrandX size={20} />,
    },
  ];

  return (
    <Popover shadow="md" position="top-end" width={194}>
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown p={8} className={dropdownClassProp}>
        <Stack>
          <Stack spacing="xs">
            {shareLinks.map(({ type, onClick, render }) => (
              <Group
                key={type}
                spacing={8}
                p={12}
                align="flex-start"
                className="flex flex-1 w-full items-center cursor-pointer hover:bg-[#262728] rounded-lg"
                onClick={onClick}
              >
                <div>{render}</div>
                <Text className="text-[unset] text-[14px]">{type}</Text>
              </Group>
            ))}
          </Stack>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
