import { ActionIcon, Box, Group, ScrollArea, createStyles } from '@mantine/core';
import { IconBrush, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import XBadge from '~/omnimuse-lib/components/XBadge';
import { useEffect, useRef, useState } from 'react';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { IModelVersions } from '~/request/api/model/type';

const useStyles = createStyles((theme) => ({
  scrollContainer: { position: 'relative' },

  arrowButton: {
    '&:active': {
      transform: 'none',
    },
  },

  hidden: {
    display: 'none !important',
  },

  leftArrow: {
    display: 'none',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    paddingRight: theme.spacing.xl,
    zIndex: 12,
    backgroundImage: theme.fn.gradient({
      from: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
      to: 'transparent',
      deg: 90,
    }),

    [containerQuery.largerThan('md')]: {
      display: 'block',
    },
  },
  rightArrow: {
    display: 'none',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    paddingLeft: theme.spacing.xl,
    zIndex: 12,
    backgroundImage: theme.fn.gradient({
      from: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
      to: 'transparent',
      deg: 270,
    }),

    [containerQuery.largerThan('md')]: {
      display: 'block',
    },
  },
  viewport: {
    overflowX: 'scroll',
    overflowY: 'hidden',
  },
}));

type State = {
  scrollPosition: { x: number; y: number };
  atStart: boolean;
  atEnd: boolean;
  largerThanViewport: boolean;
};

export function ModelVersionList({ versions, selected, onVersionClick }: Props) {
  const { classes, cx } = useStyles();

  const viewportRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>({
    scrollPosition: { x: 0, y: 0 },
    atStart: true,
    atEnd: false,
    largerThanViewport: false,
  });

  const scrollLeft = () => viewportRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => viewportRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  useEffect(() => {
    if (viewportRef.current) {
      const newValue = viewportRef.current.scrollWidth > viewportRef.current.offsetWidth;

      if (newValue !== state.largerThanViewport)
        setState((state) => ({ ...state, largerThanViewport: newValue }));
    }
  }, [state.largerThanViewport]);

  return (
    <ScrollArea
      className={classes.scrollContainer}
      classNames={classes}
      viewportRef={viewportRef}
      onScrollPositionChange={(scrollPosition) =>
        setState((state) => ({
          ...state,
          scrollPosition,
          largerThanViewport:
            !!viewportRef.current &&
            viewportRef.current.scrollWidth > viewportRef.current.offsetWidth,
          atStart: scrollPosition.x === 0,
          atEnd:
            !!viewportRef.current &&
            scrollPosition.x >=
              viewportRef.current.scrollWidth - viewportRef.current.offsetWidth - 1,
        }))
      }
      type="never"
    >
      <Box className={cx(classes.leftArrow, state.atStart && classes.hidden)}>
        <ActionIcon
          className={classes.arrowButton}
          variant="transparent"
          radius="xl"
          onClick={scrollLeft}
        >
          <IconChevronLeft />
        </ActionIcon>
      </Box>
      <Group spacing={10} noWrap>
        {versions.map((version) => {
          const active = selected === version.id;
          const versionButton = (
            <XBadge
              key={version.id}
              onClick={() => {
                onVersionClick(version);
                return;
              }}
              isActive={active}
              size="md"
              type="version"
              className="min-w-20"
            >
              <div className="flex items-center justify-center gap-1.5">
                {version.canGenerate && <IconBrush size={16} stroke={2.5} />}
                <span>{version.name}</span>
              </div>
            </XBadge>
          );

          return versionButton;
        })}
      </Group>
      <Box
        className={cx(
          classes.rightArrow,
          (state.atEnd || !state.largerThanViewport) && classes.hidden
        )}
      >
        <ActionIcon
          className={classes.arrowButton}
          variant="transparent"
          radius="xl"
          onClick={scrollRight}
        >
          <IconChevronRight />
        </ActionIcon>
      </Box>
    </ScrollArea>
  );
}

type Props = {
  versions: IModelVersions[];
  onVersionClick: (version: IModelVersions) => void;
  selected?: number;
};
