import OneKeyMap from '@essentials/one-key-map';
import trieMemoize from 'trie-memoize';
import { Button, Stack, createStyles, useMantineTheme } from '@mantine/core';
import React, { useMemo } from 'react';
import { MasonryRenderItemProps } from '~/components/MasonryColumns/masonry.types';
import { useMasonryContext } from '~/components/MasonryColumns/MasonryProvider';
import { Paper, Text } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconCaretRightFilled } from '@tabler/icons-react';
import Image from 'next/image';
import { createAdFeed } from '~/utils/ads.utils';

type Props<TData> = {
  data: TData[];
  render: React.ComponentType<MasonryRenderItemProps<TData>>;
  itemId?: (data: TData) => string | number;
  empty?: React.ReactNode;
  diyColumnWidth?: number;
};

export function MasonryDataSetGrid<TData>({
  data,
  render: RenderComponent,
  itemId,
  empty = null,
  diyColumnWidth,
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
            : `repeat(${columnCount}, ${diyColumnWidth || columnWidth}px)`,
      }}
    >
      {items.map((item, index) => {
        const key = item.type === 'data' ? itemId?.(item.data) ?? index : `ad_${index}`;
        return (
          <React.Fragment key={key}>
            {item.type === 'data' &&
              createRenderElement(RenderComponent, index, item.data, columnWidth)}
            {item.type === 'ad' && (
              <Paper
                radius="sm"
                sx={(theme) => ({
                  overflow: 'hidden',
                  width: 320,
                  background:
                    theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[0],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexDirection: 'column',
                })}
                pb={10}
                pt={20}
                withBorder
                shadow="sm"
              >
                <Stack mb="auto" spacing="xs">
                  <div style={{ height: 30 }}>
                    <Image
                      src={`/images/logo_${theme.colorScheme}_mode.png`}
                      alt="Omnimuse logo"
                      height={30}
                      width={142}
                    />
                  </div>
                  <Text>Become a supporter to turn off ads today.</Text>
                  <Button
                    component={NextLink}
                    href="/pricing"
                    compact
                    color="green"
                    variant="outline"
                  >
                    <Text weight={500}>Do It</Text>
                    <IconCaretRightFilled size={16} />
                  </Button>
                </Stack>
              </Paper>
            )}
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
