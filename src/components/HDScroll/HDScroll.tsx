import { createStyles, Center, Loader } from '@mantine/core';
import { useEffect, useState, useCallback } from 'react';
import { SimpleGrid } from '@mantine/core';
import { NoContent } from '~/components/NoContent/NoContent';
import { throttle } from 'lodash';

export function HDScroll({
  requestBody = {}, // 请求参数
  pagekey = 'page',
  loadData = (resp: any) => {},
  filter = (resp: any) => {},
  height = 600,
  Component,
  componentKey = 'id',
  breakpoints = [
    { minWidth: 'xs', cols: 1 },
    { minWidth: 'sm', cols: 2 },
    { minWidth: 'md', cols: 2 },
    { minWidth: 'lg', cols: 3 },
    { minWidth: 'xl', cols: 4 },
  ],
}: any) {
  const { classes, cx } = useStyles();
  useEffect(() => {
    setList([]);
    setHasMoreDate(true);
    setPage(1);
    load(1);
  }, [requestBody]);

  // const [total, setTotal] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0); // 用于追踪上一次滚动位置
  const [isloading, setIsloading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreDate, setHasMoreDate] = useState(false);
  const [list, setList] = useState([]);

  const load = async (page: number) => {
    if (!Object.keys(requestBody).length) {
      return;
    }
    page == 1 && setIsloading(true);
    page > 1 && setIsMoreLoading(true);
    page == 1 && setList([]);
    const options = Object.assign(requestBody, { [pagekey]: page });
    try {
      const resp = await loadData(options).finally(() => {
        setIsloading(false);
        setIsMoreLoading(false);
      });
      const data = filter(resp);
      setList(page == 1 ? data : list.concat(data));
      setHasMoreDate(!!data.length);
      // setTotal(resp.total);
    } catch (error) {
      console.error('Failed to fetch', error);
    }
  };

  const onScroll = (e: any) => {
    // 滚动条的总高度 el.scrollHeight
    const scrollHeight = e.target.scrollHeight;
    // 可视区的高度 el.clientHeight
    const height = e.target.clientHeight;
    // 滚动条距离顶部高度 el.scrollTop
    const scrollTop = e.target.scrollTop;

    if (scrollTop > lastScrollTop && scrollHeight - scrollTop - height < 200) {
      if (!hasMoreDate) return;
      if (isMoreLoading) return;
      if (isloading) return;
      setPage(page + 1);
      load(page + 1);
    }

    setLastScrollTop(scrollTop); // 更新最后滚动位置
  };

  return (
    <div
      onScroll={onScroll}
      style={{
        maxHeight: height + 'px',
        height: '100%',
        overflowY: list.length ? 'scroll' : 'hidden',
        paddingBottom: '30px',
      }}
      className={cx(classes.wrap)}
    >
      {list.length ? (
        <>
          <SimpleGrid
            spacing="xl"
            breakpoints={breakpoints}
            style={{
              width: 'max-content',
            }}
          >
            {list.map((item) => (
              <Component key={item[componentKey]} info={item} />
            ))}
          </SimpleGrid>
          {isMoreLoading && (
            <Center className="size-full" sx={{ height: '100%' }}>
              <Loader />
            </Center>
          )}
        </>
      ) : isloading ? (
        <Center className="size-full" sx={{ height: '100%' }}>
          <Loader />
        </Center>
      ) : (
        <Center sx={{ height: '100%' }}>
          <NoContent message="" />
        </Center>
      )}
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  wrap: {
    width: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
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
}));
