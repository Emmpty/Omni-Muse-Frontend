import React, { useState } from 'react';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import UserProfileLayout from '~/omnimuse-lib/features/user/UserProfileLayout';
import { createStyles } from '@mantine/core';
import { ImageCard } from '~/components/HDCard/ImageCard';
import { HDScroll } from '~/components/HDScroll/HDScroll';
import { imageslist } from '~/request/api/generate';

const UserImagePageWrap = () => {
  const { classes } = useStyle();
  const [requestBody, setRequestBody] = useState({
    publish: 'published',
    pageSize: 30,
  });

  const filter = ({ result = [] }: any) => {
    return (result.records || []).map((item: any) => {
      return {
        id: item.idStr,
        image: item.cid,
        reactions: item.reactions,
        routerPath: `/images/${item.idStr}`,
        rewardCount: item.rewardCount,
      };
    });
  };

  return (
    <div className={classes.wrap}>
      <HDScroll
        requestBody={requestBody}
        loadData={imageslist}
        filter={filter}
        height={778}
        Component={ImageCard}
        breakpoints={[
          { minWidth: 'xs', cols: 1 },
          { minWidth: 'sm', cols: 2 },
          { minWidth: 'md', cols: 2 },
          { minWidth: 1480, cols: 3 },
          { minWidth: 1800, cols: 4 },
        ]}
        pagekey="pageNum"
        componentKey="id"
      />
    </div>
  );
};

setPageOptions(UserImagePageWrap, { innerLayout: UserProfileLayout });
export default UserImagePageWrap;

const useStyle = createStyles((theme) => ({
  wrap: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    padding: '30px ',
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
