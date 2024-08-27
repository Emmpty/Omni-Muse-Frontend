import React, { useEffect, useState } from 'react';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import UserProfileLayout from '~/omnimuse-lib/features/user/UserProfileLayout';
import { createStyles } from '@mantine/core';
import { BountiesCard } from '~/components/HDCard/BountiesCard';
import { HDScroll } from '~/components/HDScroll/HDScroll';
import { getBountiesList } from '~/request/api/user';
import { useRouter } from 'next/router';
import { useUserStore } from '~/store/user.store';
import { bountyItem } from '~/request/api/user/type';

const UserBountiesPageWrap = () => {
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
    return (result || []).map((item: bountyItem) => {
      const imgArray =
        item.image.length > 0
          ? Array.isArray(JSON.parse(item.image))
            ? JSON.parse(item.image)
            : []
          : [];
      return {
        id: item.id,
        name: item.name,
        time: item.expiresAt,
        type: item.type,
        avatar: item.avatar,
        image: imgArray[0],
        bounty: item.bounty,
        user: item.user,
        userId: item.userId,
        download: item.download,
        collect: item.collect,
        comment: item.comment,
        expiresAt: item.expiresAt,
        startsAt: item.startsAt,
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
          <div className={statusType === 2 ? 'item checked' : 'item'} onClick={() => tab(2)}>
            Over
          </div>
          <div className={statusType === 1 ? 'item checked' : 'item'} onClick={() => tab(1)}>
            Draft
          </div>
        </div>
      )}

      <HDScroll
        requestBody={requestBody}
        loadData={getBountiesList}
        filter={filter}
        height={778}
        Component={BountiesCardComponetnts}
        componentKey="id"
      />
    </div>
  );
};

function BountiesCardComponetnts(props: any) {
  return (
    <BountiesCard {...props} hrefLink={`/bounties/${props.info.id}/${props.info.name}?type=edit`} />
  );
}

setPageOptions(UserBountiesPageWrap, { innerLayout: UserProfileLayout });
export default UserBountiesPageWrap;

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
      '&:first-of-type::after,&:nth-of-type(2)::after': {
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
