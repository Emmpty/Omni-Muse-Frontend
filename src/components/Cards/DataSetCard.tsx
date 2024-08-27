import { Text, Image, Avatar } from '@mantine/core';
import { IconHeart, IconMessageCircle2, IconStar } from '@tabler/icons-react';
import React from 'react';
import { useCardStyles } from '~/components/Cards/Cards.styles';
import { FeedCard } from '~/components/Cards/FeedCard';
import { IconBadge } from '~/components/IconBadge/IconBadge';
import { DataSetGetAll } from '~/types/router';
import { abbreviateNumber } from '~/utils/number-helpers';
import { slugit } from '~/utils/string-helpers';
import { DaysFromNow } from '../Dates/DaysFromNow';

export function DataSetCard({ data }: Props) {
  const { theme } = useCardStyles({ aspectRatio: 1 });
  const {
    id,
    name,
    createdAt,
    likeCount,
    downloadCount,
    username,
    starCount,
    avatar,
    commentCount,
    rewardCount,
  } = data;

  const countdownBadge = (
    <div>
      <Text size="md">
        <DaysFromNow inUtc date={createdAt} withoutSuffix />
      </Text>
    </div>
  );

  return (
    <FeedCard href={`/data-set/${id}/${slugit(name)}`} aspectRatio="listItem">
      <div className="p-[20px] relative h-full flex flex-col justify-between">
        <div className="flex justify-start items-center">
          <Avatar style={{ marginRight: '10px' }} size={22} src={avatar} radius="xl" />
          <div className={'overflow-hidden overflow-ellipsis w-[80%] text-[14px]'}>{username}</div>
        </div>
        <div className="">
          <Text color="#9B9C9E" size={12}>
            {countdownBadge}
          </Text>
          <div className="mt-[6px]">
            <Text size="xl" weight={700} lineClamp={2} lh={1.2}>
              {name}
            </Text>
          </div>
        </div>
        <div className="flex justify-start items-center ">
          <IconBadge
            icon={<Image src="/images/icon/stop.svg" alt="" />}
            color={theme.colorScheme === 'dark' ? 'dark' : 'gray.0'}
            p={0}
            size="lg"
            styles={{
              root: {
                background: 'transparent',
              },
            }}
            // @ts-ignore: transparent variant does work
            variant="transparent"
          >
            <Text size="xs" className="mr-[12px]">
              {abbreviateNumber(rewardCount ?? 0)}
            </Text>
          </IconBadge>

          <IconBadge
            icon={<IconMessageCircle2 size={14} />}
            color={theme.colorScheme === 'dark' ? 'dark' : 'gray.0'}
            p={0}
            size="lg"
            styles={{
              root: {
                background: 'transparent',
              },
            }}
            // @ts-ignore
            variant="transparent"
          >
            <Text size="xs" className="mr-[12px]">
              {abbreviateNumber(commentCount ?? 0)}
            </Text>
          </IconBadge>

          <IconBadge
            icon={<IconHeart size={14} stroke={1.5} />}
            p={0}
            styles={{
              root: {
                background: 'transparent',
              },
            }}
            size="lg"
            // @ts-ignore
            variant="transparent"
          >
            <Text size="xs" className="mr-[12px]">
              {abbreviateNumber(likeCount ?? 0)}
            </Text>
          </IconBadge>

          <IconBadge
            icon={<Image src="/images/icon/download.svg" width={14} alt="" />}
            p={0}
            size="lg"
            styles={{
              root: {
                background: 'transparent',
              },
            }}
            // @ts-ignore: transparent variant does work
            variant="transparent"
          >
            <Text size="xs" className="mr-[12px]">
              {abbreviateNumber(downloadCount ?? 0)}
            </Text>
          </IconBadge>

          <IconBadge
            icon={<IconStar size={14} />}
            color={theme.colorScheme === 'dark' ? 'dark' : 'gray.0'}
            p={0}
            size="lg"
            styles={{
              root: {
                background: 'transparent',
              },
            }}
            // @ts-ignore
            variant="transparent"
          >
            <Text size="xs">{abbreviateNumber(starCount ?? 0)}</Text>
          </IconBadge>
        </div>
      </div>
    </FeedCard>
  );
}

type Props = { data: DataSetGetAll[number] };
