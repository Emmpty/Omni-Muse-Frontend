import { Center, Loader, SimpleGrid } from '@mantine/core';
import { useState, useEffect, useMemo } from 'react';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import { FeedLayout } from '~/components/AppLayout/FeedLayout';
import { Meta } from '~/components/Meta/Meta';
import { NoContent } from '~/components/NoContent/NoContent';
import { env } from '~/env/client.mjs';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { getEventsList as fetchEventsList } from '~/request/api/events';
import { create } from 'zustand';
import dayjs from 'dayjs';
import { EventsCard } from '~/components/HDCard/EventsCard';
import { createStyles } from '@mantine/core';
import { useRouter } from 'next/router';

export const getServerSideProps = createServerSideProps({
  useSSG: true,
  resolver: async ({ ssg }) => {
    await ssg?.article.getEvents.prefetch();
  },
});

export const useEventStore = create((set) => ({
  params: {
    stage: 'process',
    sort: 'hot',
    time: 'all',
    keywords: '',
    pageNum: 1,
    pageSize: 9,
  },
  reload: (params: any) =>
    set((state: any) => ({ params: Object.assign({}, state.params, params) })),
}));

export default function EventsPage() {
  const router = useRouter();
  const [pageNum, setPage] = useState(1);
  const [isInitLoading, setInitLoading] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0); // 用于追踪上一次滚动位置
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [eventsList, setEventsList] = useState([]);
  const params = useEventStore((state: any) => state.params); // 从 zustand 中获取 params
  const { classes, cx } = useStyles();

  const loadEvents = async (options: any) => {
    if (isLoading) return;
    setIsLoading(true);
    if (options.pageNum == 1) {
      setInitLoading(true);
    }
    try {
      const times = calculateRaceStart({ time: options.time });
      const data = {
        ...options,
        ...times,
      };

      const { code, result } = (await fetchEventsList(data)) as any;
      if (code === 200 && result.records) {
        const records = result.records;
        if (options.pageNum == 1) {
          setEventsList(records);
        } else {
          setEventsList(eventsList.concat(records));
        }
        setTotal(result.total);
      } else {
        // 可以处理错误情况
        console.error('Failed to fetch events:', result);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
      setInitLoading(false);
    }
  };

  const calculateRaceStart = (params: any) => {
    const { time } = params;
    const today = dayjs(); // 获取当前日期
    let raceStart: any;

    switch (time) {
      case 'day':
        raceStart = today.subtract(0, 'day');
        break;
      case 'week':
        raceStart = today.subtract(1, 'week');
        break;
      case 'month':
        raceStart = today.subtract(1, 'month');
        break;
      case 'year':
        raceStart = today.subtract(1, 'year');
        break;
      case 'all':
        raceStart = ''; // 假设 "所有时间" 起始于10年前
        break;
      default:
        raceStart = today; // 如果传入未知参数，默认返回今天的午夜开始
    }

    // 格式化为 ISO 8601 字符串，包括时区
    return !raceStart
      ? {}
      : {
          RaceStart: raceStart.startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'),
          // RaceFinish: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ssZ'), // 假设RaceFinish都是今天
        };
  };

  // useEffect(() => {
  //   loadEvents(Object.assign({}, params, { pageNum: 1 }));
  // }, [params]);

  useEffect(() => {
    const { keywords = '' } = router.query || {};
    loadEvents(Object.assign({}, params, { keywords }, { pageNum: 1 }));
  }, [router.query.keywords, params]);

  // const articles = eventMockData?.items ?? [];

  const articles = useMemo(
    () =>
      eventsList.map((item: any) => {
        return {
          id: item.idStr,
          name: item.title,
          image: item.banner.split(',')[0],
          state: item.status || 0,
          view: item.popularity || 0,
          startTime: item.raceStart,
          endTime: item.raceFinish,
        };
      }) || [],
    [eventsList]
  );

  const onScroll = (e: any) => {
    if (eventsList.length >= total) return;
    const scrollHeight = e.target.scrollHeight; // 滚动条的总高度
    const height = e.target.clientHeight; // 可视区的高度
    const scrollTop = e.target.scrollTop; // 滚动条距离顶部的高度

    // 检查是否向下滚动并接近底部
    if (scrollTop > lastScrollTop && scrollHeight - scrollTop - height < 200) {
      if (isLoading) return;
      setPage(pageNum + 1);
      loadEvents(Object.assign({}, params, { pageNum: pageNum + 1 }));
    }

    setLastScrollTop(scrollTop); // 更新最后滚动位置
  };

  return (
    <>
      <Meta
        title="Omnimuse Events | Fun AI Art challenges"
        description="Test your AI Art Skills by participating in our community events."
        links={[{ href: `${env.NEXT_PUBLIC_BASE_URL}/events`, rel: 'canonical' }]}
      />
      <div className={cx(classes.wrap)} onScroll={onScroll}>
        {isInitLoading ? (
          <Center>
            <Loader size="xl" />
          </Center>
        ) : eventsList.length > 0 ? (
          <div className={`w-full flex justify-center ${cx(classes.item)}`}>
            <SimpleGrid
              spacing="xl"
              px={32}
              breakpoints={[
                { minWidth: 'xs', cols: 1 },
                { minWidth: 'sm', cols: 2 },
                { minWidth: 'md', cols: 2 },
                { minWidth: 1200, cols: 3 },
                { minWidth: 1600, cols: 4 },
              ]}
              style={{
                overflow: 'hidden',
                width: 'max-content',
              }}
            >
              {articles.map((info: any) => (
                <EventsCard
                  key={info.id}
                  info={info}
                  hrefLink={`/events/eventDetails/${info.id}/${info.name}`}
                />
              ))}
            </SimpleGrid>
            {isLoading && (
              <Center>
                <Loader size="xl" />
              </Center>
            )}
          </div>
        ) : (
          <NoContent />
        )}
      </div>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  wrap: {
    margin: '0 auto',
    width: '100%',
    maxHeight: 'calc(100vh - 220px)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '10px',
      height: '1px',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
      background: '#686868',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
      borderRadius: '10px',
      background: '#424242',
    },
  },
  item: {
    margin: '16px 0',
    width: '100%',
    maxWidth: '1690px',
    flexDirection: 'column',
    display: 'flex',
  },
}));
setPageOptions(EventsPage, { innerLayout: FeedLayout });
