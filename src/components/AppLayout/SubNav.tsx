import { Group, Paper, createStyles } from '@mantine/core';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { BountyFeedFilters } from '~/components/Filters/FeedFilters/BountyFeedFilters';
import { ModelFeedFilters } from '~/components/Filters/FeedFilters/ModelFeedFilters';
import { EventFilters } from '~/components/Filters/FeedFilters/EventFeedFilters';
import { DataSetFilters } from '~/components/Filters/FeedFilters/DataSetFeedFilters';
import { HomeTabs } from '~/components/HomeContentToggle/HomeContentToggle';
import { useScrollAreaRef } from '~/components/ScrollArea/ScrollArea';

const useStyles = createStyles((theme) => ({
  subNav: {
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 100,
    padding: `0 ${theme.spacing.md}px`,
    borderRadius: 0,
    transition: 'all 0.3s',
    background: theme.colors.omnimuse1[0],
    height: '60px',
  },
}));

const filtersBySection = {
  home: null,
  models: <ModelFeedFilters />,
  bounties: <BountyFeedFilters />,
  events: <EventFilters />,
  'data-set': <DataSetFilters />,
} as const;
type HomeSection = keyof typeof filtersBySection;
const sections = Object.keys(filtersBySection) as Array<HomeSection>;

export function SubNav() {
  const { classes } = useStyles();
  const router = useRouter();

  const currentScroll = useRef(0);
  const subNavRef = useRef<HTMLDivElement>(null);

  const currentPath = router.pathname.replace('/', '') || 'home';
  const isFeedPage = sections.includes(currentPath as HomeSection);
  const node = useScrollAreaRef({
    onScroll: () => {
      if (!node?.current) return;

      const scroll = node.current.scrollTop;
      if (currentScroll.current > 0) {
        subNavRef?.current?.style?.setProperty('background', 'rgba(0, 0, 0, 1)');
      } else {
        subNavRef?.current?.style?.setProperty('background', 'rgba(0, 0, 0, 0.5)');
      }

      currentScroll.current = scroll;
    },
  });

  return (
    <Paper
      ref={subNavRef}
      className={classes.subNav}
      shadow="xs"
      py={4}
      px={40}
      mb={currentPath !== 'home' ? 'md' : undefined}
    >
      <Group spacing={8} position="apart" noWrap={currentPath === 'home'}>
        <HomeTabs variant="default" color="primary.3" />
        <div style={{ marginBottom: '4px' }}>
          {isFeedPage && (filtersBySection[currentPath as HomeSection] ?? null)}
        </div>
      </Group>
    </Paper>
  );
}
