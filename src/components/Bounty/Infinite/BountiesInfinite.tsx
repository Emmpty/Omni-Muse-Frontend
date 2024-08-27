import { Center, Loader } from '@mantine/core';
import { useMemo } from 'react';
import { EndOfFeed } from '~/components/EndOfFeed/EndOfFeed';
import { NoContent } from '~/components/NoContent/NoContent';
import { MasonryGrid } from '~/components/MasonryColumns/MasonryGrid';
import { BountiesCard } from '~/components/HDCard/BountiesCard';
import { Item } from '~/request/api/bounty/type';
import { bountyItem } from '~/request/api/user/type';

export function BountiesInfinite({ showEof = false, dataList, hasNextPage, isInitLoading }: Props) {
  // console.log(dataList);
  const listData: Item[] = useMemo(() => dataList || [], [dataList]);
  return (
    <>
      {isInitLoading ? (
        <Center p="xl">
          <Loader size="xl" />
        </Center>
      ) : listData.length > 0 ? (
        <div className="relative pt-[20px] pb-[40px]">
          <MasonryGrid
            data={listData}
            render={BountiesCardItem}
            itemId={(x: any) => x.id}
            empty={<NoContent />}
          />
          {!hasNextPage && showEof && <EndOfFeed />}
        </div>
      ) : (
        <NoContent />
      )}
    </>
  );
}

function BountiesCardItem(props: any) {
  const itemData: any = props.data;
  const data: bountyItem = {
    id: itemData.id,
    type: itemData.type,
    time: itemData.expiresAt,
    avatar: itemData.avatar,
    user: itemData.username,
    userId: itemData.user_id,
    image:
      itemData.image_id == 'null' || !itemData.image_id
        ? ''
        : JSON.parse(itemData.image_id || '[]').at(0),
    name: itemData.name,
    bounty: itemData.unit_amount || 0,
    collect: itemData.favorite_count_all_time || 0,
    comment: itemData.comment_count_all_time || 0,
    participants: itemData.entry_count_all_time || 0,
  };
  return (
    <BountiesCard {...props.data} info={data} hrefLink={`/bounties/${data.id}/${data.name}`} />
  );
}

type Props = {
  showEof?: boolean;
  dataList: Item[];
  hasNextPage: boolean;
  isInitLoading: boolean;
};
