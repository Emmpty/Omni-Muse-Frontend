/* eslint-disable react/jsx-no-comment-textnodes */
import { Card, createStyles, Image } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import UserAvatar from '~/omnimuse-lib/features/user/UserAvatar';
import dayjs from 'dayjs';
import Link from 'next/link';

export function DatasetCard({
  info = {
    id: '',
    Id: '',
    type: '',
    time: '',
    avatar: '',
    user: '',
    name: '',
    download: '',
    collect: 0,
    comment: 0,
    like: 0,
    rewardCount: 0,
    reward: 0,
  },
  hrefLink,
  cardWidth,
}: any) {
  const { classes, cx } = useStyles();
  const handlerLinkUser = (event: any) => {
    if (!info?.userId) {
      event.preventDefault();
    }
  };

  return (
    <Link href={hrefLink} passHref>
      <Card className={cx(classes.card)} style={{ width: cardWidth ? cardWidth : '437px' }}>
        <div className="user-wrap">
          <Link href={`/user/${info?.userId}/model`}>
            <a className="flex justify-start items-center" onClick={handlerLinkUser}>
              <UserAvatar size="xs" src={info.avatar} />
              <div className="user">{info.user}</div>
            </a>
          </Link>
        </div>

        <div className="info-wrap">
          <div className="time">{dayjs(info.time).fromNow()}</div>
          <div className="name">{info.name}</div>
          <div className="tools">
            <div className="left">
              <Image src="/images/models/Stop.svg" alt="" />
              <div className="v">{info.reward || info.rewardCount || 0}</div>

              <Image src="/images/models/chat.svg" alt="" />
              <div className="v">{info.comment || 0}</div>

              <Image src="/images/models/download_line.svg" alt="" />
              <div className="v">{info.download || 0}</div>

              <IconHeart size={14} color="#FFF" />
              <div className="v">{info.like || 0}</div>

              <Image src="/images/models/star_line.svg" alt="" />
              <div className="v">{info.collect || 0}</div>
            </div>

            <div className="right"></div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

const useStyles = createStyles(() => ({
  root: {
    background: 'var(--color-secondary-bg)',
  },
  card: {
    borderRadius: '6px',
    height: '196px',
    // width: '437px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    padding: '0 !important',
    background: 'var(--color-secondary-bg)',
    flexShrink: 0,
    '.user-wrap': {
      display: 'flex',
      margin: '20px',
      '.user': {
        marginLeft: '10px',
        fontSize: '14px',
        fontFamily: 'PingFang SC',
        color: '#fff',
      },
    },
    '.time': {
      textTransform: 'capitalize',
      fontSize: '12px',
      color: '#9B9C9E',
    },
    '.name': {
      fontSize: '20px',
      color: '#fff',
      marginBottom: '30px',
      marginTop: '6px',
      maxWidth: '420px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '.image': {
      minWidth: '320px',
      height: '100%',
      flexShrink: 0,
    },
    '.type-wrap': {
      position: 'absolute',
      top: '10px',
      left: '10px',
      display: 'flex',
      borderRadius: '12px',
      padding: '4px 12px',
      background: 'rgba(0, 0, 0, 0.40)',
      color: '#fff',
      fontSize: '12px',
      boxSizing: 'border-box',
      alignItems: 'center',
    },
    '.info-wrap': {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      padding: '20px',

      '.tools': {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        '.left,.right': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          '.v': {
            fontSize: '12px',
            fontFamily: 'PingFang SC',
            color: '#fff',
            marginLeft: '2px',
            marginRight: '12px',
            '&:last-of-type': {
              marginRight: 0,
            },
          },
        },
      },
    },
  },
}));
