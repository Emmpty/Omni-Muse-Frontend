import React, { useEffect, useState } from 'react';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import UserProfileLayout from '~/omnimuse-lib/features/user/UserProfileLayout';
import { createStyles } from '@mantine/core';
import { DatasetCard } from '~/components/HDCard/DatasetCard';
import { HDScroll } from '~/components/HDScroll/HDScroll';
import { getUserDataSets } from '~/request/api/user';
import { useRouter } from 'next/router';
import { useUserStore } from '~/store/user.store';
import { dataSetItem } from '~/request/api/user/type';

const UserDataSetPageWrap = () => {
  const { classes } = useStyle();
  const [statusType, setState] = useState(0);
  const [userId, setUserId] = useState(0);
  const router = useRouter();
  const currentUser = useUserStore((state) => state.userInfo);
  const [requestBody, setRequestBody] = useState({});
  const PageSize = 10;
  useEffect(() => {
    const { username = 1, type } = router.query;
    setUserId(+username);
    if (type == 'draft') {
      // 草稿
      setState(1);
      setRequestBody({
        isType: 1,
        userId: +username,
        pageSize: PageSize,
      });
    } else {
      setRequestBody({
        isType: 0,
        userId: +username,
        pageSize: PageSize,
      });
    }
  }, [router.query]);

  const tab = (type: number) => {
    const { username = 1 } = router.query;
    setState(type);
    setRequestBody({
      isType: type,
      userId: +username,
      pageSize: PageSize,
    });
  };

  const filter = ({ result = [] }: any) => {
    return (result || []).map((item: dataSetItem) => {
      return {
        id: item.id,
        time: item.time,
        avatar: item.avatar,
        user: item.user,
        name: item.name,
        download: item.download,
        collect: item.collect,
        comment: item.comment,
        like: item.like,
        userId: item.userId,
        rewardCount: item.rewardCount,
        reward: item.reward,
        statusType: statusType,
      };
    });
  };

  return (
    <div className={classes.wrap}>
      {currentUser?.id == userId && (
        <div className={classes.tabs}>
          <div className={statusType === 0 ? 'item checked' : 'item'} onClick={() => tab(0)}>
            Published
          </div>
          <div className={statusType === 1 ? 'item checked' : 'item'} onClick={() => tab(1)}>
            Draft
          </div>
        </div>
      )}

      <HDScroll
        requestBody={requestBody}
        loadData={getUserDataSets}
        filter={filter}
        breakpoints={[
          { minWidth: 'xs', cols: 1 },
          { minWidth: 'sm', cols: 1 },
          { minWidth: 'md', cols: 2 },
          { minWidth: 'lg', cols: 3 },
        ]}
        height={778}
        Component={DatasetCardComponetnts}
        componentKey="id"
      />
    </div>
  );
};

function DatasetCardComponetnts(props: any) {
  return (
    <DatasetCard {...props} hrefLink={`/data-set/${props.info.id}/${props.info.name}?type=edit`} />
  );
}

setPageOptions(UserDataSetPageWrap, { innerLayout: UserProfileLayout });
export default UserDataSetPageWrap;

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
      '&:first-of-type::after': {
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
