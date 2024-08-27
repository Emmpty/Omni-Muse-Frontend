import OneKeyMap from '@essentials/one-key-map';
import trieMemoize from 'trie-memoize';
import { createStyles, useMantineTheme } from '@mantine/core';
import React, { useMemo } from 'react';
import { MasonryRenderItemProps } from '~/components/MasonryColumns/masonry.types';
import { useMasonryContext } from '~/components/MasonryColumns/MasonryProvider';
import { createAdFeed } from '~/utils/ads.utils';

type Props<TData> = {
  data: TData[];
  render: React.ComponentType<MasonryRenderItemProps<TData>>;
  itemId?: (data: TData) => string | number;
  empty?: React.ReactNode;
  withAds?: boolean;
};

export function MasonryGrid<TData>({
  data,
  render: RenderComponent,
  itemId,
  empty = null,
  withAds,
}: Props<TData>) {
  const theme = useMantineTheme();
  const { columnCount, columnWidth, columnGap, rowGap, maxSingleColumnWidth } = useMasonryContext();

  const { classes } = useStyles({
    columnWidth,
    columnGap,
    rowGap,
  });

  const items = useMemo(
    () => createAdFeed({ data, columnCount, showAds: false }),
    [columnCount, data]
  );

  return items.length ? (
    <div
      className={classes.grid}
      style={{
        gridTemplateColumns:
          columnCount === 1
            ? `minmax(${columnWidth}px, ${maxSingleColumnWidth}px)`
            : `repeat(${columnCount}, ${columnWidth}px)`,
      }}
    >
      {items.map((item, index) => {
        const key = item.id ?? index;
        return (
          <React.Fragment key={key}>
            {item.type === 'data' &&
              createRenderElement(RenderComponent, index, item.data, columnWidth)}
          </React.Fragment>
        );
      })}
    </div>
  ) : (
    <div className={classes.empty}>{empty}</div>
  );
}

const useStyles = createStyles(
  (
    theme,
    {
      columnWidth,
      columnGap,
      rowGap,
    }: {
      columnWidth: number;
      columnGap: number;
      rowGap: number;
    }
  ) => ({
    empty: { height: columnWidth },
    grid: {
      display: 'grid',

      columnGap,
      rowGap,
      justifyContent: 'center',
    },
  })
);

const createRenderElement = trieMemoize(
  [OneKeyMap, {}, WeakMap, OneKeyMap, OneKeyMap],
  (RenderComponent, index, data, columnWidth) => (
    <RenderComponent index={index} data={data} width={columnWidth} height={columnWidth} />
  )
);
