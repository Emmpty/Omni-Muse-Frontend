import { Paper, createStyles, Badge } from '@mantine/core';
import { IconClockHour4, IconEye } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { HDImage } from './HDImage';
import Link from 'next/link';
export function EventsCard({
  info = {
    name: 'XIXIXI',
    state: 0,
    view: 0,
    startTime: null,
    endTime: null,
  },
  hrefLink,
  style = {},
}: any) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  return (
    <Link href={hrefLink} passHref>
      <Paper
        className={cx(classes.card)}
        onClick={() => router.push('/events/eventDetails/' + info.id + '/' + info.name)}
        style={style}
      >
        <HDImage src={info.image} style={{ height: '192px' }} />

        <div className="info-wrap">
          <div className="name truncate ...">{info.name}</div>
          <div className="tools">
            <div className="left">
              {/* <div className={'state ' + `s${info.state}`}>
                {info.state == 1 ? 'Ongoing' : info.state == 3 ? 'Finished' : 'Upcoming'}
              </div> */}
              {info.state == 1 && (
                <Badge
                  className="normal-case font-medium"
                  radius="lg"
                  variant="gradient"
                  gradient={{ from: 'primary.4', to: '#7760FF', deg: 90 }}
                >
                  {'Ongoing'}
                </Badge>
              )}
              {info.state == 2 && (
                <Badge className="normal-case bg-[#838383] text-[#fff] font-medium" radius="lg">
                  {'Upcoming'}
                </Badge>
              )}
              {info.state == 3 && (
                <Badge className="normal-case bg-[#04CD58] text-[#fff] font-medium" radius="lg">
                  {'Finishing'}
                </Badge>
              )}
              <IconEye size={16} className="ml-3" />
              <div className="v">{info.view}</div>
            </div>

            <div className="right">
              <IconClockHour4 size={16} />
              <div className="time">
                {' '}
                {dayjs(info.startTime).format('MMM D, YYYY ')} -{' '}
                {dayjs(info.endTime).format('MMM D, YYYY ')}
              </div>
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
    height: '294px',
    width: '410px',
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
    background: '#2B2D30',
    '.image': {
      width: '100%',
      height: 'auto',
    },
    '.info-wrap': {
      position: 'absolute',
      bottom: '0',
      left: 0,
      width: '100%',
      height: '102px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box',
      padding: '0px 16px',
      background: 'linear-gradient(transparent, rgba(0,0,0,.6))',
      '.name': {
        fontSize: '20px',
        fontFamily: 'PingFang SC',
        color: '#fff',
        marginBottom: '12px',
        fontWeight: 600,
      },

      '.tools': {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        '.left': {
          '.state': {
            height: '20px',
            lineHeight: '20px',
            padding: '0px 8px',
            marginRight: '12px',
            display: 'flex',
            alignItems: 'center',
            '&.s1': {
              background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
              borderRadius: '16px',
            },
          },
          '.v': {
            marginLeft: '2px',
          },
        },
        '.right': {
          '.time': {
            marginLeft: '2px',
          },
        },
        '.left,.right': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          fontSize: '12px',
          fontFamily: 'PingFang SC',
          color: '#fff',
        },
      },
    },
  },
}));
