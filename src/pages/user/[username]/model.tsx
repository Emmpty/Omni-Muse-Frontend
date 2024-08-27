import React, { useEffect, useState, useMemo } from 'react';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import UserProfileLayout from '~/omnimuse-lib/features/user/UserProfileLayout';
import { createStyles } from '@mantine/core';
import { ModelCard } from '~/components/HDCard/ModelCard';
import { HDScroll } from '~/components/HDScroll/HDScroll';
import { getUserModels } from '~/request/api/model';
import { useRouter } from 'next/router';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';
const UserProfileEntry = () => {
  const { classes } = useStyle();
  const [isType, setState] = useState(0);
  const { getIsOwner } = useUserInfo();
  const router = useRouter();

  const [requestBody, setRequestBody] = useState({});
  useEffect(() => {
    const { username = -1, type = 0 } = router.query;
    setState(+type);
    setRequestBody({
      isType: +type || 0,
      pageSize: 30,
      userId: +username,
    });
  }, [router.query]);

  const isMaster = useMemo(() => {
    const getOwner = getIsOwner();
    return getOwner(Number(router.query?.username));
  }, [getIsOwner, router.query?.username]);

  const tab = (type: number) => {
    const { username = -1 } = router.query;
    setState(type);
    router.replace(`/user/${username}/model?type=${type}`);
    setRequestBody({
      isType: type,
      pageSize: 30,
      userId: +username,
    });
  };

  const filter = ({ result = [] }: any) => {
    return (result || []).map((item: any) => {
      return {
        id: item.modelId,
        type: item.type,
        avatar: item.avatar || '',
        user: item.user || '',
        image: item.image || '',
        name: item.name,
        download: item.download || 0,
        collect: item.collect || 0,
        comment: item.comment || 0,
        reward: item.reward || 0,
        like: item.like || 0,
        userId: item.userId,
        auditStatus: item.auditStatus || '',
        auditType: item.auditType || '',
      };
    });
  };

  return (
    <div className={classes.wrap}>
      {isMaster ? (
        <div className={classes.tabs}>
          <div className={isType === 0 ? 'item checked' : 'item'} onClick={() => tab(0)}>
            Published
          </div>
          <div className={isType === 2 ? 'item checked' : 'item'} onClick={() => tab(2)}>
            Auditing
          </div>
          <div className={isType === 1 ? 'item checked' : 'item'} onClick={() => tab(1)}>
            Draft
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '24px' }}></div>
      )}

      <HDScroll
        requestBody={requestBody}
        loadData={getUserModels}
        filter={filter}
        height={778}
        Component={X}
        componentKey="id"
      />
    </div>
  );
};

function X(props: any) {
  return (
    <ModelCard
      {...props}
      flage={true}
      hrefLink={`/models/${props.info.id}/${props.info.name}?status=${props.info.auditType}`}
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
