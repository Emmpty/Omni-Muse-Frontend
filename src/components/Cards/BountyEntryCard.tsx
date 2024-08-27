import { createStyles, Group, keyframes, Stack, Text, Image, Avatar } from '@mantine/core';
import React from 'react';
import { FeedCard } from '~/components/Cards/FeedCard';
import { useCardStyles } from '~/components/Cards/Cards.styles';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';

import { BountyGetEntries } from '~/types/router';
import { MediaHash } from '~/components/ImageHash/ImageHash';
import { DaysFromNow } from '~/components/Dates/DaysFromNow';

import HoverActionButton from '~/components/Cards/components/HoverActionButton';
import { IconFiles } from '@tabler/icons-react';

import { truncate } from 'lodash-es';
import { constants } from '~/server/common/constants';
import { ImageGuard2 } from '~/components/ImageGuard/ImageGuard2';

const IMAGE_CARD_WIDTH = 450;

const moveBackground = keyframes({
  '0%': {
    backgroundPosition: '0% 50%',
  },
  '50%': {
    backgroundPosition: '100% 50%',
  },
  '100%': {
    backgroundPosition: '0% 50%',
  },
});

const useStyles = createStyles((theme) => ({
  awardedBanner: {
    background: theme.fn.linearGradient(45, theme.colors.yellow[4], theme.colors.yellow[1]),
    animation: `${moveBackground} 5s ease infinite`,
    backgroundSize: '200% 200%',
    color: theme.colors.yellow[7],
  },
}));

export function BountyEntryCard({ data, renderActions }: Props) {
  const { classes: awardedStyles } = useStyles();
  const { classes, cx } = useCardStyles({ aspectRatio: 1 });

  const { images, awardedUnitAmountTotal } = data;
  const image = images?.[0];
  const isAwarded = awardedUnitAmountTotal > 0;
  return (
    <FeedCard
      aspectRatio="enterItem"
      href={`/bounties/${data.bountyId}/entries/${data.id}`}
      pos="relative"
    >
      <div
        className={cx(
          classes.root,
          classes.noHover,
          'flex flex-col justify-stretch items-stretch h-full'
        )}
      >
        <Stack
          className={
            (cx({
              [awardedStyles.awardedBanner]: isAwarded,
            }),
            'px-[10px] py-[16px] bg-[var(--color-secondary-bg)]')
          }
        >
          <Group position="apart" noWrap>
            <div className="flex justify-start items-center">
              <div className="cursor-pointer">
                <Avatar src={data.userInfo.image} radius="xl" size={40} />
              </div>
              <div className="ml-2">
                <div>{data.userInfo?.username}</div>
                <Text size="xs" color="dimmed">
                  <DaysFromNow date={data.createdAt} />
                </Text>
              </div>
            </div>

            <Group>
              <div>
                <Image
                  src="/images/icon/gold.svg"
                  width={24}
                  height={24}
                  className="m-auto"
                  alt=""
                />
                <div className="text-center text-[12px]">{data.rewardCount || 0}</div>
              </div>
            </Group>
          </Group>
        </Stack>

        <div className="relative flex-1">
          <EdgeMedia
            src={data.cover}
            cid={data.imageList[0]}
            width={IMAGE_CARD_WIDTH}
            className={classes.image}
            wrapperProps={{ style: { height: 'calc(100% - 60px)' } }}
          />
          {image && (
            <ImageGuard2 image={image} connectId={data.id} connectType="bounty">
              {(safe) => (
                <>
                  <ImageGuard2.BlurToggle className="absolute top-2 left-2 z-10" />
                  <Stack className="absolute top-2 right-2 z-10">
                    <HoverActionButton
                      label="Files"
                      size={30}
                      color="gray.6"
                      variant="filled"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      keepIconOnHover
                    >
                      <IconFiles stroke={2.5} size={16} />
                    </HoverActionButton>
                    {renderActions && <>{renderActions(data)} </>}
                  </Stack>

                  {safe ? (
                    <EdgeMedia
                      src={image.url}
                      name={image.name ?? image.id.toString()}
                      type={image.type}
                      alt={
                        image.meta
                          ? truncate(image.meta.prompt, { length: constants.altTruncateLength })
                          : image.name ?? undefined
                      }
                      width={IMAGE_CARD_WIDTH}
                      className={classes.image}
                      wrapperProps={{ style: { height: 'calc(100% - 60px)' } }}
                    />
                  ) : (
                    <MediaHash {...image} />
                  )}
                </>
              )}
            </ImageGuard2>
          )}
        </div>
      </div>
    </FeedCard>
  );
}

type Props = {
  data: Omit<BountyGetEntries[number], 'files'>;
  currency: number;
  renderActions?: (bountyEntry: Omit<BountyGetEntries[number], 'files'>) => React.ReactNode;
};
