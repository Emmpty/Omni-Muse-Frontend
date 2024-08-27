import React, { useEffect, useState } from 'react';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import UserProfileLayout from '~/omnimuse-lib/features/user/UserProfileLayout';
import { createStyles } from '@mantine/core';
import { ModelCard } from '~/components/HDCard/ModelCard';
import { ImageCard } from '~/components/HDCard/ImageCard';
import { DatasetCard } from '~/components/HDCard/DatasetCard';
import { BountiesCard } from '~/components/HDCard/BountiesCard';
import { HDScroll } from '~/components/HDScroll/HDScroll';
import { useRouter } from 'next/router';
import { getUserCollects } from '~/request/api/user';
const UserProfileEntry = () => {
  const { classes } = useStyle();
  const [isType, setState] = useState(1);
  const router = useRouter();
  const [requestBody, setRequestBody] = useState({});
  useEffect(() => {
    const { username = -1 } = router.query;
    setRequestBody({
      isType: 1,
      pageSize: 30,
      userId: +username,
    });
  }, [router.query]);
  const tab = (type: number) => {
    const { username = -1 } = router.query;
    setState(type);
    setRequestBody({
      isType: type,
      pageSize: 30,
      userId: +username,
    });
  };

  const filter = ({ result }: any) => {
    if (isType == 1) {
      return (result || []).map((item: any) => {
        return {
          id: item.modelId,
          type: item.type,
          avatar: item.avatar || '',
          user: item.user || '',
          image: item.image,
          name: item.name,
          download: item.download || 0,
          collect: item.collect || 0,
          comment: item.comment || 0,
          reward: item.reward || 0,
          rewardCount: item.rewardCount || 0,
          like: item.like || 0,
        };
      });
    } else if (isType == 2) {
      return (result || []).map((item: any) => {
        return {
          id: item.imageId,
          imageId: item.imageId,
          image: item.image,
          reactions: item.reactions,
          reward: item.reward || 0,
          rewardCount: item.rewardCount,
        };
      });
    } else if (isType == 3) {
      return (result || []).map((item: any) => {
        return {
          id: item.id,
          Id: item.Id,
          type: item.type,
          time: item.time,
          avatar: item.avatar || '',
          user: item.user || '',
          image: JSON.parse(item.image || '[]').at(0),
          name: item.name,
          userId: item.userId,
          bounty: item.bounty || 0,
          collect: item.collect || 0,
          comment: item.comment || 0,
          participants: item.participants || 0,
        };
      });
    } else if (isType == 4) {
      return (result || []).map((item: any) => {
        return {
          id: item.id || item.Id,
          type: item.type,
          time: item.time,
          avatar: item.avatar || '',
          user: item.user || '',
          name: item.name,
          download: item.download || 0,
          userId: item.userId,
          collect: item.collect || 0,
          comment: item.comment || 0,
          reward: item.reward || 0,
          rewardCount: item.rewardCount || 0,
          like: item.like || 0,
        };
      });
    }

    return [];
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.tabs}>
        <div className={isType === 1 ? 'item checked' : 'item'} onClick={() => tab(1)}>
          Model
        </div>
        <div className={isType === 2 ? 'item checked' : 'item'} onClick={() => tab(2)}>
          Image
        </div>
        <div className={isType === 4 ? 'item checked' : 'item'} onClick={() => tab(4)}>
          Data Set
        </div>
        <div className={isType === 3 ? 'item checked' : 'item'} onClick={() => tab(3)}>
          Bounties
        </div>
      </div>
      <HDScroll
        requestBody={requestBody}
        loadData={getUserCollects}
        filter={filter}
        height={778}
        breakpoints={
          isType == 4
            ? [
                { minWidth: 'xs', cols: 1 },
                { minWidth: 'sm', cols: 1 },
                { minWidth: 'md', cols: 2 },
                { minWidth: 'lg', cols: 2 },
                { minWidth: 'xl', cols: 3 },
              ]
            : [
                { minWidth: 'xs', cols: 1 },
                { minWidth: 'sm', cols: 2 },
                { minWidth: 'md', cols: 2 },
                { minWidth: 'lg', cols: 3 },
                { minWidth: 'xl', cols: 4 },
              ]
        }
        Component={isType == 1 ? M : isType == 2 ? ImageCard : isType == 3 ? K : Y}
        componentKey="id"
      />
    </div>
  );
};

function M(props: any) {
  return <ModelCard {...props} hrefLink={`/models/${props.info.id}/${props.info.name}`} />;
}

function Y(props: any) {
  return (
    <DatasetCard
      {...props}
      hrefLink={`/data-set/${props.info.id}/${props.info.name}?type=collect`}
    />
  );
}

function K(props: any) {
  return (
    <BountiesCard
      {...props}
      hrefLink={`/bounties/${props.info.id}/${props.info.name}?type=collect`}
    />
  );
}

setPageOptions(UserProfileEntry, { innerLayout: UserProfileLayout });
export default UserProfileEntry;

const useStyle = createStyles(() => ({
  wrap: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    padding: '0 30px',
  },
  tabs: {
    width: 'fit-content',
    borderRadius: '8px',
    border: '1px solid #2B2D30',
    background: 'rgba(43, 45, 48, 0.50)',
    display: 'flex',
    flexDirection: 'row',
    margin: '30px 0',
    padding: '8px 12px',
    '.item': {
      color: '#9B9C9E',
      fontFamily: 'PingFang SC',
      marginRight: '24px',
      fontSize: '12px',
      cursor: 'pointer',
      position: 'relative',
      '&:nth-of-type(1)::after, &:nth-of-type(2)::after, &:nth-of-type(3)::after': {
        content: "''",
        display: 'block',
        width: '1px',
        height: '10px',
        backgroundColor: 'rgba(255,255,255,0.3)',
        position: 'absolute',
        right: '-12px',
        top: '50%',
        transform: 'translate(0px, -50%)',
      },
      '&:last-of-type': {
        marginRight: 0,
      },
      '&.checked': {
        color: '#FFF',
      },
    },
  },
  list: {
    overflow: 'hidden',
    overflowY: 'scroll',
    maxHeight: '778px',
  },
}));
