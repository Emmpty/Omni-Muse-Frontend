import { Paper, createStyles, Image } from '@mantine/core';
import { IconClockHour4 } from '@tabler/icons-react';
import UserAvatar from '~/omnimuse-lib/features/user/UserAvatar';
import dayjs from 'dayjs';
// import { useRouter } from 'next/router';
import { HDImage } from './HDImage';
import Link from 'next/link';

export function BountiesCard({
  info = {
    name: '',
    time: '',
    type: '',
    avatar: '',
    image: '',
    unitAmount: '',
    user: '',
    download: '',
    collect: '',
    comment: '',
  },
  hrefLink,
}: any) {
  const { classes, cx } = useStyles();
  const handlerLinkUser = (event: any) => {
    if (!info?.userId) {
      event.preventDefault();
    }
  };
  return (
    <Link href={hrefLink} passHref>
      <Paper className={cx(classes.card)}>
        <HDImage src={info.image} />
        {dayjs(Date.now()).isBefore(dayjs(info.time)) ? (
          <div className="type-wrap">
            <div className="type after">{info.type}</div>
            <div className="ml-[14px] time-wrap">
              <IconClockHour4 size={14} className="inline-block" />
              <div className="time inline-block">{dayjs(info.time).fromNow()}</div>
            </div>
          </div>
        ) : (
          <div className="type-wrap over">
            <div className="type after">{info.type}</div>
            <div className="ml-[14px] time-wrap">
              <IconClockHour4 size={14} className="inline-block" />
              <div className="time inline-block">over</div>
            </div>
          </div>
        )}

        <div className="info-wrap">
          <div className="user-wrap">
            <Link href={`/user/${info?.userId}/model`}>
              <a className="flex justify-start items-center" onClick={handlerLinkUser}>
                <UserAvatar size="xs" src={info.avatar} />
                <div className="user">{info.user}</div>
              </a>
            </Link>
          </div>
          <div className="name overflow-hidden line-clamp-2">{info.name}</div>
          <div className="tools">
            <div className="left">
              <Image src="/images/models/gold.svg" style={{ marginRight: '2px' }} alt="" />
              <div className="v">{info.bounty || 0}</div>
            </div>

            <div className="right">
              <Image src="/images/models/star_line.svg" alt="" />
              <div className="v">{info.collect || 0}</div>

              <Image src="/images/models/chat.svg" alt="" />
              <div className="v">{info.comment || 0}</div>

              {/* <IconUsers size={12} style={{ fontWeight: 700 }} /> */}
              <Image src="/images/models/Users.svg" alt="" />
              <div className="v">{info.participants || 0}</div>
            </div>
          </div>
        </div>
      </Paper>
    </Link>
  );
}

const useStyles = createStyles(() => ({
  card: {
    borderRadius: '6px',
    height: '412px',
    width: '320px',
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',

    '.image': {
      width: '100%',
      height: '100%',
    },
    '.type-wrap': {
      position: 'absolute',
      top: '10px',
      left: '10px',
      display: 'flex',
      borderRadius: '32px',
      height: '26px',
      lineHeight: '26px',
      padding: '0px 12px',
      background: 'rgba(0, 0, 0, 0.40)',
      color: '#fff',
      fontSize: '12px',
      boxSizing: 'border-box',
      alignItems: 'center',
      '&.over': {
        color: '#9B9C9E',
      },
      '.time-wrap': {
        svg: {
          marginBottom: '2px',
        },
      },
      '.type': {
        position: 'relative',
      },
      '.type.after::after': {
        content: "''",
        position: 'absolute',
        display: 'block',
        width: '1px',
        height: '10px',
        top: '50%',
        right: '-8px',
        transform: 'translate(0,-50%)',
        backgroundColor: 'rgba(255,255,255,0.3)',
      },
      '.time': {
        marginLeft: '2px',
      },
    },
    '.info-wrap': {
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      padding: '10px 16px',
      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.70) 77.27%)',
      '.user-wrap': {
        display: 'flex',
        '.user': {
          marginLeft: '10px',
          fontSize: '14px',
          fontFamily: 'PingFang SC',
          color: '#fff',
        },
      },
      '.name': {
        fontSize: '20px',
        fontFamily: 'PingFang SC',
        color: '#fff',
        margin: '10px 0',
        fontWeight: 'bolder',
      },

      '.tools': {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        '.left': {
          borderRadius: '16px',
          background: 'rgba(0, 0, 0, 0.50)',
          padding: '2px 8px',
          '.v': {
            color: '#FFA223 !important',
          },
        },
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
