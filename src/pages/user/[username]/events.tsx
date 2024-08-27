import React, { useState, useMemo } from 'react';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import UserProfileLayout from '~/omnimuse-lib/features/user/UserProfileLayout';
import { createStyles } from '@mantine/core';
import { EventsCard } from '~/components/HDCard/EventsCard';
import { HDScroll } from '~/components/HDScroll/HDScroll';
import { getAdminEventsList as fetchEventsList } from '~/request/api/events';
import { useRouter } from 'next/router';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';

const UserImagePageWrap = () => {
  const { classes, cx } = useStyle();
  const publishType = [
    { label: 'All', value: 'all' },
    { label: 'Finish', value: 'finish' },
    { label: 'Process', value: 'process' },
  ];
  const router = useRouter();
  const { getIsOwner } = useUserInfo();

  const userId = useMemo(() => {
    return Number(router.query?.username);
  }, [router.query?.username]);

  const isOwner = useMemo(() => {
    const getOwner = getIsOwner();
    return getOwner(Number(userId));
  }, [getIsOwner, userId]);

  const [requestBody, setRequestBody] = useState({
    userId: userId,
    stage: 'all',
    pageSize: 9,
  });

  const tab = (type: string) => {
    setRequestBody({
      userId: userId,
      stage: type,
      pageSize: 9,
    });
  };

  const filter = ({ result = [] }: any) => {
    return (result.records || []).map((item: any) => {
      return {
        id: item.idStr,
        name: item.title,
        image: item.banner.split(',')[0],
        state: item.status || 0,
        view: item.popularity || 0,
        startTime: item.raceStart,
        endTime: item.raceFinish,
      };
    });
  };

  return (
    <div className={classes.wrap}>
      {isOwner && (
        <div className={classes.tabs}>
          {publishType.map((type, index) => (
            <div
              key={type.value}
              className={requestBody.stage === type.value ? 'item checked' : 'item'}
              onClick={() => tab(type.value)}
            >
              {type.label}
            </div>
          ))}
        </div>
      )}

      <HDScroll
        requestBody={requestBody}
        breakpoints={[
          { minWidth: 'xs', cols: 1 },
          { minWidth: 'sm', cols: 2 },
          { minWidth: 'md', cols: 2 },
          { minWidth: 'lg', cols: 3 },
        ]}
        loadData={fetchEventsList}
        filter={filter}
        height={728}
        Component={EventsCardComponetnts}
        pagekey="pageNum"
        componentKey="id"
      />
    </div>
  );
};

function EventsCardComponetnts(props: any) {
  return (
    <EventsCard {...props} hrefLink={`/events/eventDetails/${props.info.id}/${props.info.name}`} />
  );
}

setPageOptions(UserImagePageWrap, { innerLayout: UserProfileLayout });
export default UserImagePageWrap;

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
      '&:first-of-type::after,&:nth-child(2)::after': {
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
