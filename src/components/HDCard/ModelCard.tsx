import { Card, createStyles, Image } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import UserAvatar from '~/omnimuse-lib/features/user/UserAvatar';
import { HDImage } from './HDImage';
import { abbreviateNumber } from '~/utils/number-helpers';
import Link from 'next/link';
import { showNotification } from '@mantine/notifications';
export function ModelCard({
  info = {
    type: 'Type',
    avatar: '',
    user: 'Bai',
    image: 'QmZYwhFyo6FKoxK36HDizssJVy22bjZKRjrBctap7jtTGa',
    name: 'XIXIXI',
    download: 0,
    collect: 0,
    comment: 0,
    reward: 0,
    like: 0,
    rewardCount: 0,
  },
  flage = false,
  hrefLink,
}: any) {
  const { classes, cx } = useStyles();
  const handleClick = (event: any) => {
    if (flage && info.auditType === 'audit') {
      event.preventDefault();
      showNotification({
        color: 'red',
        title: '',
        message: 'Cannot be viewed during review',
      });
    }
  };
  return (
    <Link href={hrefLink} passHref>
      <Card className={cx(classes.card)} onClick={handleClick}>
        <HDImage src={info.image} />

        <div className="type-wrap">
          <div className="type">{info.type}</div>
          {info.auditType == 'audit_fail' && <div className="type fail">Review failed</div>}
          {info.auditType == 'audit' && <div className="type training">Training</div>}
        </div>

        <div className="info-wrap">
          <div className="user-wrap">
            <Link href={`/user/${info?.userId}/model`}>
              <a className="flex justify-start items-center">
                <UserAvatar size="xs" src={info.avatar} />
                <div className="user">
                  {info.user
                    ? info.user.length > 20
                      ? info.user.substring(0, 6) +
                        '...' +
                        info.user.substring(info.user.length - 4)
                      : info.user
                    : ''}
                </div>
              </a>
            </Link>
          </div>
          <div className="name">{info.name}</div>
          <div className="tools">
            <div className="left">
              <Image src="/images/models/download_line.svg" alt="" />
              <div className="v">{abbreviateNumber(info.download)}</div>

              <Image src="/images/models/star_line.svg" alt="" />
              <div className="v">{abbreviateNumber(info.collect)}</div>

              <Image src="/images/models/chat.svg" alt="" />
              <div className="v">{abbreviateNumber(info.comment)}</div>

              <Image src="/images/models/Stop.svg" alt="" />
              <div className="v">{abbreviateNumber(info.reward || info.rewardCount)}</div>
            </div>

            <div className="right">
              <IconHeart size={14} color="#FFF" />

              <div className="v">{abbreviateNumber(info.like)}</div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

const useStyles = createStyles(() => ({
  card: {
    borderRadius: '12px',
    height: '412px',
    width: '320px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    padding: '0 !important',
    flexShrink: 0,
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

      '.type': {
        padding: '0px 12px',
        background: 'rgba(0, 0, 0, 0.40)',
        color: '#fff',
        fontSize: '12px',
        boxSizing: 'border-box',
        alignItems: 'center',
        borderRadius: '32px',
        height: '26px',
        lineHeight: '26px',
        fontWeight: 700,
      },
      '.type.fail': {
        background: 'rgba(255, 48, 48, 0.70)',
        marginLeft: '8px',
      },
      '.type.training': {
        background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
        marginLeft: '8px',
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
