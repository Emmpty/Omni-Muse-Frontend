import { Stack, createStyles } from '@mantine/core';
import { BountiesInfinite } from '~/components/Bounty/Infinite/BountiesInfinite';
import { MasonryContainer } from '~/components/MasonryColumns/MasonryContainer';
import { MasonryProvider } from '~/components/MasonryColumns/MasonryProvider';
import { Meta } from '~/components/Meta/Meta';
import { constants } from '~/server/common/constants';
import { env } from '~/env/client.mjs';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { FeedLayout } from '~/components/AppLayout/FeedLayout';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import { useRouter } from 'next/router';
import { create } from 'zustand';
import { useEffect, useState, useMemo } from 'react';
import { throttle } from 'lodash-es';
import { getBountiesList } from '~/request/api/bounty';
import React from 'react';
import { bountyListParmas, Item } from '~/request/api/bounty/type';

// export const getServerSideProps = createServerSideProps({
//   useSession: true,
//   resolver: async ({ features }) => {
//     if (!features?.bounties) return { notFound: true };
//   },
// });

const useStyles = createStyles((theme) => ({
  wrap: {
    overflow: 'hidden',
    overflowY: 'scroll',
    width: '100%',
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
  label: {
    padding: '6px 16px',
    textTransform: 'capitalize',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors.gray[3], 0.06)
        : theme.fn.rgba(theme.colors.gray[9], 0.06),
  },
  labelActive: {
    backgroundColor: 'transparent',
    '&,&:hover': {
      color: theme.colors.dark[9],
    },
  },
  active: {
    backgroundColor: theme.white,
  },
  root: {
    backgroundColor: 'transparent',
    gap: 8,
    padding: 0,

    [containerQuery.smallerThan('sm')]: {
      overflow: 'auto hidden',
      maxWidth: '100%',
    },
  },
  control: { border: 'none !important' },
}));

export const useEventStore = create((set) => ({
  params: {
    keywords: '',
    filter: {
      TimePeriod: 'All Time',
      BountiesType: [],
      BountiesStatus: 'In progress',
    },
    sort: 'highest bounty',
    page: 1,
    limit: 10,
  },
  reload: (params: bountyListParmas) =>
    set((state: any) => ({ params: Object.assign({}, state.params, params) })),
}));

export default function BountiesPage() {
  const { classes } = useStyles();
  const router = useRouter();

  const [pageNum, setPage] = useState(1);
  const [lastScrollTop, setLastScrollTop] = useState(0); // 用于追踪上一次滚动位置
  const [total, setTotal] = useState(0);

  const [bounties, setDounties] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitLoading, setInitLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const paramsData: bountyListParmas = useEventStore((state) => state.params);
  const reload: (params: bountyListParmas) => void = useEventStore((state: any) => state.reload);

  const onScroll: React.UIEventHandler<HTMLDivElement> = throttle((event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return; // 如果事件目标不存在，直接返回
    if (bounties.length >= total) return;
    if (!hasNextPage) {
      return;
    }
    const scrollHeight = target.scrollHeight; // 滚动条的总高度
    const height = target.clientHeight; // 可视区的高度
    const scrollTop = target.scrollTop; // 滚动条距离顶部的高度
    // // 检查是否向下滚动并接近底部
    if (scrollTop > lastScrollTop && scrollHeight - scrollTop - height < 50) {
      // console.log('到底了');
      if (isLoading) return;
      setPage(pageNum + 1);
      loadEvents(Object.assign({}, paramsData, { page: pageNum + 1 }));
    }
    setLastScrollTop(scrollTop); // 更新最后滚动位置
  }, 500);

  useEffect(() => {
    if (router.query?.keywords) {
      const { keywords = '' } = router.query || {};
      reload(Object.assign({ keywords }, { ...paramsData, page: 1 }));
      setTimeout(() => {
        loadEvents(paramsData);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.keywords]);

  useEffect(() => {
    loadEvents(paramsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsData]);

  const loadEvents = async (options: bountyListParmas) => {
    console.log('参数', options);
    if (isLoading) return;
    setIsLoading(true);
    if (options.page == 1) {
      setInitLoading(true);
    }
    try {
      const res = await getBountiesList(options);
      if (res.code === 200 && res.result.currentPage === 1) {
        // 第一次请求
        setDounties(res.result.items);
        setIsLoading(false);
        setTotal(res.result.totalCount);
        setHasNextPage(res.result.hasMore);
      } else {
        setDounties(bounties.concat(res.result.items));
        setIsLoading(false);
        setHasNextPage(res.result.hasMore);
      }
      setTimeout(() => {
        setInitLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setTimeout(() => {
        setInitLoading(false);
      }, 500);
      setIsLoading(false);
    }
  };

  const dataList = useMemo(() => bounties || [], [bounties]);

  return (
    <>
      <div className={classes.wrap} onScroll={onScroll}>
        <Meta
          title="Collaborate on Generative AI Art With Omnimuse Bounties"
          description="Post bounties and collaborate with generative AI creators, or make your mark in Omnimuse and earn Buzz by successfully completing them"
          links={[{ href: `${env.NEXT_PUBLIC_BASE_URL}/bounties`, rel: 'canonical' }]}
        />
        <MasonryProvider
          columnWidth={constants.cardSizes.bounty}
          maxColumnCount={7}
          maxSingleColumnWidth={450}
        >
          <MasonryContainer>
            <Stack spacing="xs" className="mb-40px">
              <BountiesInfinite
                dataList={dataList}
                isInitLoading={isInitLoading}
                hasNextPage={hasNextPage}
              />
            </Stack>
          </MasonryContainer>
        </MasonryProvider>
      </div>
    </>
  );
}

setPageOptions(BountiesPage, { innerLayout: FeedLayout });
