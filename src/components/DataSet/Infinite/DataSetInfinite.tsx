import { Center, Loader } from '@mantine/core';
import { EndOfFeed } from '~/components/EndOfFeed/EndOfFeed';
import { NoContent } from '~/components/NoContent/NoContent';
import { MasonryDataSetGrid } from '~/components/MasonryColumns/MasonryDataSetGrid';
// import { DataSetCard } from '~/components/Cards/DataSetCard';
import { DatasetCard } from '~/components/HDCard/DatasetCard';
import { dataSetItem } from '~/request/api/user/type';
export function DataSetInfinite({ showEof = false, dataList, hasNextPage, isInitLoading }: Props) {
  return (
    <>
      {isInitLoading ? (
        <Center p="xl">
          <Loader size="xl" />
        </Center>
      ) : !!dataList.length ? (
        <div style={{ position: 'relative' }}>
          <MasonryDataSetGrid
            data={dataList}
            render={DataSetCardItem}
            itemId={(item) => item.id}
            empty={<NoContent />}
            diyColumnWidth={410}
          />
          {!hasNextPage && showEof && <EndOfFeed />}
        </div>
      ) : (
        <NoContent />
      )}
    </>
  );
}

function DataSetCardItem(props: any) {
  const itemData: any = props.data;
  const data: dataSetItem = {
    id: itemData.id,
    time: itemData.createdAt,
    avatar: itemData.avatar,
    user: itemData.username,
    name: itemData.name,
    download: itemData.downloadCount,
    collect: itemData.starCount,
    comment: itemData.rewardCount,
    like: itemData.likeCount,
    userId: itemData.userId,
    rewardCount: itemData.rewardCount,
    reward: itemData.reward,
  };
  return (
    <DatasetCard
      {...props.data}
      info={data}
      hrefLink={`/data-set/${data.id}/${data.name}`}
      cardWidth="auto"
    />
  );
}

type Props = { showEof?: boolean; dataList: any; hasNextPage: boolean; isInitLoading: boolean };
