import { Badge, Group, Stack, Text, Image, Flex, Avatar } from '@mantine/core';
import { IconMessageCircle2, IconUsers, IconStar } from '@tabler/icons-react';

import React from 'react';
import { useCardStyles } from '~/components/Cards/Cards.styles';
import { FeedCard } from '~/components/Cards/FeedCard';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { BountyGetAll } from '~/types/router';
import { abbreviateNumber } from '~/utils/number-helpers';
import { getDisplayName } from '~/utils/string-helpers';
import { DaysFromNow } from '../Dates/DaysFromNow';
import { ImageGuard2 } from '~/components/ImageGuard/ImageGuard2';

const IMAGE_CARD_WIDTH = 450;

export function BountyCard({ data }: Props) {
  const { classes, cx } = useCardStyles({ aspectRatio: 1 });

  const {
    images,
    type,
    created_at,
    id,
    username,
    name,
    unit_amount,
    favorite_count_all_time,
    comment_count_all_time,
    entry_count_all_time,
    image_id,
    avatar,
  } = data;
  const image = images?.[0] || {};
  const imgData = image_id.length > 0 && JSON.parse(image_id);
  const imageLits = Array.isArray(imgData) ? imgData : [];
  // const countdownBadge = <DaysFromNow date={created_at} withoutSuffix />

  return (
    <FeedCard href={`/bounties/${id}/${name}`} aspectRatio="portrait">
      <div className={classes.root} style={{ height: '100%' }}>
        {image && (
          <ImageGuard2 image={image} connectId={id} connectType="bounty">
            {() => (
              <>
                <Group
                  spacing={4}
                  position="apart"
                  className={cx(classes.contentOverlay, classes.top)}
                  noWrap
                >
                  <Group spacing={8}>
                    <ImageGuard2.BlurToggle h={26} radius="xl" />
                    {type && (
                      <Badge
                        className={cx(classes.infoChip, classes.chip)}
                        variant="light"
                        radius="xl"
                      >
                        <Text color="white" size={'lx'} transform="capitalize">
                          {getDisplayName(type)}
                          <div
                            style={{
                              background: '#FFF',
                              opacity: 0.3,
                              width: '1px',
                              height: '8px',
                              display: 'inline-block',
                              margin: ' 0 5px',
                            }}
                          ></div>
                          <DaysFromNow date={created_at} withoutSuffix />
                        </Text>
                      </Badge>
                    )}
                  </Group>
                </Group>
                {imageLits && (
                  <EdgeMedia
                    width={IMAGE_CARD_WIDTH}
                    src={imageLits[0]}
                    cid={imageLits[0]}
                    className={classes.image}
                    wrapperProps={{ style: { height: 'calc(100% - 60px)' } }}
                  />
                )}
              </>
            )}
          </ImageGuard2>
        )}

        <Stack
          className={cx(classes.contentOverlay, classes.bottom, classes.fullOverlay)}
          spacing="sm"
        >
          <Flex
            mih={50}
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
            style={{
              marginBottom: '-10px',
            }}
          >
            <Avatar style={{ marginRight: '10px' }} size="sm" src={avatar} radius="xl" />
            <div className={'overflow-hidden overflow-ellipsis w-[80%]'}>{username}</div>
          </Flex>
          <div
            style={{
              marginBottom: '10px',
            }}
          >
            <Text size="xl" weight={700} lineClamp={2} lh={1.2}>
              {name}
            </Text>
          </div>
          <Group spacing={8} position="apart">
            <Group spacing="xs" noWrap>
              <div
                className="flex justify-between justify-items-center rounded-full bg-[#2b2d3070] py-[3px] px-[4px]"
                style={{
                  borderRadius: '16px',
                  background: 'rgba(0, 0, 0, 0.50)',
                  padding: '2px 8px',
                }}
              >
                <div
                  style={{
                    marginRight: '2px',
                  }}
                >
                  <Image width={18} height={18} src="/images/icon/gold.svg" alt="" />
                </div>
                <div>
                  <Text size="xs" color="#FFA223">
                    {abbreviateNumber(unit_amount)}
                  </Text>
                </div>
              </div>
            </Group>
            <Group spacing="xs" noWrap>
              <Flex gap="5px" justify="flex-start" align="center" direction="row" wrap="wrap">
                <IconStar size={14} />
                <Text size="xs">{abbreviateNumber(favorite_count_all_time ?? 0)}</Text>
              </Flex>

              <Flex gap="5px" justify="flex-start" align="center" direction="row" wrap="wrap">
                <IconMessageCircle2 size={14} />
                <Text size="xs">{abbreviateNumber(comment_count_all_time ?? 0)}</Text>
              </Flex>

              <Flex gap="5px" justify="flex-start" align="center" direction="row" wrap="wrap">
                <IconUsers size={14} />
                <Text size="xs">{abbreviateNumber(entry_count_all_time ?? 0)}</Text>
              </Flex>
            </Group>
          </Group>
        </Stack>
      </div>
    </FeedCard>
  );
}

type Props = { data: BountyGetAll[number] };
