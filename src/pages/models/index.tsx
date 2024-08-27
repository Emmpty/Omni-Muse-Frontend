import { Stack, createStyles, SimpleGrid, Center, Loader } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CategoryTags } from '~/components/CategoryTags/CategoryTags';
import { NoContent } from '~/components/NoContent/NoContent';
import { create } from 'zustand';
import { modellist } from '~/request/api/model';
import { useRouter } from 'next/router';
import { ModelCard } from '~/components/HDCard/ModelCard';
// import { useGenerationnnnnStore } from '~/store/generationnnnn.store';
export const useModelStore111 = create((set) => ({
  data: {
    filter: {
      TimePeriod: ['All Time'],
    },
    sort: 'Most Bookmarks',
    tags: undefined,
    keywords: '',
  },
  reload: (data: any) => {
    return set((state: any) => ({
      data: Object.assign({}, state.data, data),
    }));
  },
}));

export default function ModelsPage() {
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

  const reload = useModelStore111((state: any) => state.reload);
  const data = useModelStore111((state: any) => state.data);
  // const opened = useGenerationnnnnStore((state: any) => state.opened);
  const router = useRouter();
  useEffect(() => {
    const { keywords = '' } = router.query || {};
    reload({
      keywords,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const { classes } = useStyle();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const load = (options: any) => {
    if (loading) return;
    setLoading(true);
    if (options.page == 1) {
      setIsLoading(true);
    }
    modellist(options)
      .then(({ result = [] }: any) => {
        const _data = result.map((item: any) => {
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

        if (options.page == 1) {
          setList(_data);
        } else {
          if (_data.length) {
            setList(list.concat(_data));
          }
        }
      })
      .finally(() => {
        setLoading(false);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    setPage(1);
    load(Object.assign({}, data, { page: 1 }));
    const unsubscribe = useModelStore111.subscribe((state: any) => {
      setPage(1);
      setList([]);
      load(Object.assign({}, state.data, { page: 1 }));
    });

    return () => unsubscribe();
  }, []);

  const onTab = (tags: any) => {
    reload({
      tags,
    });
  };

  const onscroll = (e: any) => {
    // 滚动条的总高度 el.scrollHeight
    const scrollHeight = e.target.scrollHeight;
    // 可视区的高度 el.clientHeight
    const height = e.target.clientHeight;
    // 滚动条距离顶部高度 el.scrollTop
    const scrollTop = e.target.scrollTop;

    if (scrollHeight - scrollTop - height < 200) {
      if (loading) return;
      setPage(page + 1);
      load(Object.assign({}, data, { page: page + 1 }));
    }
  };
  return (
    <Stack
      ref={ref}
      style={{
        width: '100%',
      }}
    >
      <Stack
        style={{
          overflow: 'hidden',
          width: wrapW + 'px',
          margin: '0 auto',
          paddingRight: '6px',
        }}
      >
        <CategoryTags onClick={onTab} />
      </Stack>
      <div className={classes.container} onScroll={onscroll}>
        {isLoading ? (
          <Center>
            <Loader size="xl" />
          </Center>
        ) : list.length > 0 ? (
          <div
            style={{
              width: wrapW + 'px',
              boxSizing: 'border-box',
              margin: '0 auto',
            }}
          >
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
                width: 'max-content',
              }}
            >
              {list.map((info: any) => (
                <ModelCard key={info.id} info={info} hrefLink={`/models/${info.id}/${info.name}`} />
              ))}
            </SimpleGrid>
          </div>
        ) : (
          <NoContent />
        )}
      </div>
    </Stack>
  );
}

const useStyle = createStyles(() => ({
  container: {
    margin: '0 auto',
    width: '100%',
    maxHeight: 'calc(100vh - 220px)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'scroll',
    paddingBottom: '30px',
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
  imagehover: {
    ':hover': {
      transform: 'scale(1.2)',
    },
  },
}));
