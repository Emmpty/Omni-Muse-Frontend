import { Center, Loader, SimpleGrid } from '@mantine/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Meta } from '~/components/Meta/Meta';
import { env } from '~/env/client.mjs';
import { IconChevronRight } from '@tabler/icons-react';
import { ModelCard } from '~/components/HDCard/ModelCard';
import { BountiesCard } from '~/components/HDCard/BountiesCard';
import { EventsCard } from '~/components/HDCard/EventsCard';
import { createStyles } from '@mantine/core';
import { modellist } from '~/request/api/model';
import { getHomeFeatured } from '~/request/api/home';
import { useRouter } from 'next/router';
import { useGenerationnnnnStore } from '~/store/generationnnnn.store';
export default function Home() {
  const opened = useGenerationnnnnStore((state: any) => state.opened);
  const ref = useRef<any>(null);
  const [width, setwidth] = useState(0);
  useEffect(() => {
    if (ref) {
      const resizeObserver = new ResizeObserver(() => {
        const offsetWidth = ref.current?.getBoundingClientRect().width || 0;
        setwidth(offsetWidth);
      });
      resizeObserver.observe(ref.current);

      () => {
        resizeObserver.unobserve(ref.current);
      };
    }
  }, [ref]);
  /* @动态计算 列数  START*/
  // 卡片宽度 自定义
  const imageWidth = 320;
  // 卡片间隔 自定义
  const gap = 24;

  // 列数
  const cols = useMemo(() => {
    const _w = width - 40;
    const cols = Math.floor(_w / imageWidth);
    const W = cols * imageWidth + (cols - 1) * gap;
    return W > _w ? cols - 1 : cols;
  }, [width]);

  // 卡片容器宽度
  const wrapW = useMemo(() => {
    return cols * imageWidth + (cols - 1) * gap;
  }, [cols]);
  /* @动态计算 列数  END*/

  // 事件卡片 动态计算列数
  const eventW = 410;

  const eventCols = useMemo(() => {
    const cols = Math.floor(wrapW / eventW);
    const W = cols * eventW + (cols - 1) * gap;
    return W > wrapW ? cols - 1 : cols;
  }, [wrapW]);

  const eventDW = useMemo(() => {
    const EW = eventCols * eventW + (eventCols - 1) * gap;
    return eventW + Math.floor((wrapW - EW) / eventCols);
  }, [eventCols, wrapW]);

  const [isFirstLoading, setIsFirstLoading] = useState(false);
  const { classes, cx } = useStyles();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [featured, setFeatured] = useState({
    models: [],
    bounties: [],
    events: [],
  });
  const firstLoad = () => {
    if (isFirstLoading) return;
    setIsFirstLoading(true);
    getHomeFeatured()
      .then((resp) => {
        const { models = [], bounties = [], events = [] } = resp.result;
        console.log('models', models);
        setFeatured({
          models: (models || []).map((item: any) => {
            return {
              id: item.id,
              type: item.type,
              avatar: item.avatar,
              user: item.user,
              userId: item.userId,
              image: item.image,
              name: item.name,
              download: item.download || 0,
              collect: item.collect || 0,
              comment: item.comment || 0,
              reward: item.reward || 0,
              like: item.like || 0,
            };
          }),
          bounties: (bounties || []).map((item: any) => {
            return {
              id: item.id,
              type: item.type,
              time: item.time,
              avatar: item.avatar,
              user: item.user,
              userId: item.userId,
              image:
                item.image == 'null' || !item.image ? '' : JSON.parse(item.image || '[]').at(0),
              name: item.name,
              bounty: item.bounty || 0,
              collect: item.collect || 0,
              comment: item.comment || 0,
              participants: item.participants || 0,
            };
          }),
          events: (events || []).map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              image: item.banner,
              state: item.status || 1,
              view: item.popularity || 0,
              startTime: item.startTime,
              endTime: item.endTime,
            };
          }),
        });
      })
      .finally(() => {
        setIsFirstLoading(false);
      });
  };
  useEffect(() => {
    firstLoad();
    loadmodels(1);
  }, []);

  const [page, setPage] = useState(1);
  const onscroll = (e: any) => {
    // 滚动条的总高度 el.scrollHeight
    const scrollHeight = e.target.scrollHeight;
    // 可视区的高度 el.clientHeight
    const height = e.target.clientHeight;
    // 滚动条距离顶部高度 el.scrollTop
    const scrollTop = e.target.scrollTop;

    if (scrollHeight - scrollTop - height < 200) {
      if (isLoading) return;
      setPage(page + 1);
      loadmodels(page + 1);
    }
  };

  const [list, setlist] = useState([]);
  const [hasData, setHasData] = useState(true);
  const loadmodels = (page: any) => {
    if (isLoading) return;
    if (!hasData) return;
    setIsLoading(true);
    modellist({
      filter: {
        TimePeriod: ['All Time'],
        // ModelStatus: ['Made On-Site'],
        // CheckpointType: ['All'],
      },
      sort: 'Most Bookmarks',
      page,
    })
      .then((resp) => {
        const data = (resp?.result || []).map((item: any) => {
          return {
            id: item.id,
            type: item.type,
            avatar: item.avatar,
            user: item.username,
            userId: item.userId,
            image: item.metaImage,
            name: item.modelName,
            download: item.downloadCount || 0,
            collect: item.collectCount || 0,
            comment: item.commentCount || 0,
            reward: item.rewardCount || 0,
            like: item.startCount || 0,
          };
        });

        if (!data.length) {
          setHasData(false);
        }
        setlist(page == 1 ? data : list.concat(data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <Meta
        title="Omnimuse: The Home of Open-Source Generative AI"
        description="Explore thousands of high-quality Stable Diffusion models, share your AI-generated art, and engage with a vibrant community of creators"
        links={[{ href: `${env.NEXT_PUBLIC_BASE_URL}/`, rel: 'canonical' }]}
      />
      {isFirstLoading && (
        <Center sx={{ height: 36 }} mt="md">
          <Loader size="xl" />
        </Center>
      )}
      <div
        ref={ref}
        className={cx(classes.wrap)}
        onScroll={onscroll}
        style={{
          marginLeft: opened ? '20px' : '0',
          paddingBottom: '20px',
        }}
      >
        {featured.models.length ? (
          <div className={cx(classes.item)} style={{ width: wrapW + 'px' }}>
            <div className="label-wrap">
              <div className="label">Featured Models</div>
              <div className="right" onClick={() => router.push('/models')}>
                Explore all{' '}
                <span className="more">
                  <IconChevronRight size={18} />
                </span>
              </div>
            </div>

            <SimpleGrid
              spacing="xl"
              cols={cols}
              // breakpoints={[
              //   { minWidth: 'xs', cols: 1 },
              //   { minWidth: 'sm', cols: 2 },
              //   { minWidth: 'md', cols: 3 },
              //   { minWidth: 'lg', cols: 4 },
              //   { minWidth: 'xl', cols: 5 },
              // ]}
              style={{
                maxHeight: '856px',
                overflow: 'hidden',
                width: 'max-content',
              }}
            >
              {featured.models.map((info: any) => (
                <ModelCard key={info.id} info={info} hrefLink={`/models/${info.id}/${info.name}`} />
              ))}
            </SimpleGrid>
          </div>
        ) : (
          ''
        )}
        {featured.bounties.length ? (
          <div className={cx(classes.item)} style={{ width: wrapW + 'px' }}>
            <div className="label-wrap">
              <div className="label">Featured Bounties</div>
              <div className="right" onClick={() => router.push('/bounties')}>
                Explore all{' '}
                <span className="more">
                  <IconChevronRight size={18} />
                </span>
              </div>
            </div>

            <SimpleGrid
              spacing="xl"
              cols={cols}
              // breakpoints={[
              //   { minWidth: 'xs', cols: 1 },
              //   { minWidth: 'sm', cols: 2 },
              //   { minWidth: 'md', cols: 3 },
              //   { minWidth: 'lg', cols: 4 },
              //   { minWidth: 'xl', cols: 5 },
              // ]}
              style={{
                maxHeight: '856px',
                overflow: 'hidden',
                width: 'max-content',
              }}
            >
              {featured.bounties.map((info: any) => (
                <BountiesCard
                  key={info.id}
                  info={info}
                  hrefLink={`/bounties/${info.id}/${info.name}`}
                />
              ))}
            </SimpleGrid>
          </div>
        ) : (
          ''
        )}
        {featured.events.length ? (
          <div className={cx(classes.item)} style={{ width: wrapW + 'px' }}>
            <div className="label-wrap">
              <div className="label">Featured Events</div>
              <div className="right" onClick={() => router.push('/events')}>
                Explore all{' '}
                <span className="more">
                  <IconChevronRight size={18} />
                </span>
              </div>
            </div>

            <SimpleGrid
              spacing="xl"
              cols={eventCols}
              // breakpoints={[
              //   { minWidth: 'xs', cols: 1 },
              //   { minWidth: 'sm', cols: 2 },
              //   { minWidth: 'md', cols: 3 },
              //   { minWidth: 'lg', cols: 3 },
              //   { minWidth: 'xl', cols: 4 },
              // ]}
              style={{
                maxHeight: '300px',
                overflow: 'hidden',
                width: 'max-content',
              }}
            >
              {featured.events.map((info: any) => (
                <EventsCard
                  key={info.id}
                  info={info}
                  hrefLink={`/events/eventDetails/${info.id}/${info.name}`}
                  style={{
                    width: eventDW + 'px',
                  }}
                />
              ))}
            </SimpleGrid>
          </div>
        ) : (
          ''
        )}

        {list.length ? (
          <div className={cx(classes.item)} style={{ width: wrapW + 'px' }}>
            <div className="label-wrap">
              <div className="label">Models</div>
            </div>

            <SimpleGrid
              spacing="xl"
              cols={cols}
              // breakpoints={[
              //   { minWidth: 'xs', cols: 1 },
              //   { minWidth: 'sm', cols: 2 },
              //   { minWidth: 'md', cols: 3 },
              //   { minWidth: 'lg', cols: 4 },
              //   { minWidth: 'xl', cols: 5 },
              // ]}
              style={
                {
                  // width: 'max-content',
                }
              }
            >
              {list.map((info: any) => (
                <ModelCard key={info.id} info={info} hrefLink={`/models/${info.id}/${info.name}`} />
              ))}
            </SimpleGrid>
          </div>
        ) : (
          ''
        )}

        {!isFirstLoading && isLoading && (
          <Center
            style={{
              marginTop: '40px',
            }}
          >
            <Loader size="xl" />
          </Center>
        )}
      </div>
    </>
  );
}

const useStyles = createStyles(() => ({
  wrap: {
    overflow: 'hidden',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // padding: '0 70px',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '1px',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
      background: 'rgba(254, 254, 254, 0.4)',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
      width: '10px',
      background: 'transparent',
    },
  },
  item: {
    margin: '16px 0',
    marginBottom: 0,
    // width: '100%',
    // maxWidth: '1690px',
    flexDirection: 'column',
    display: 'flex',
    '& .label-wrap': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: '24px 0',
      alignItems: 'center',
      flex: 1,
      flexShrink: 1,

      '& .label': {
        fontSize: '36px',
        color: '#fff',
        fontWeight: 600,
        fontFamily: 'PingFang SC',
      },
      '& .right': {
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        color: '#9A5DFF',
        alignItems: 'center',
        '& .more': {
          marginLeft: '2px',
        },
      },
    },
  },
}));
