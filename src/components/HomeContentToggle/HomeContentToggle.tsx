import {
  Anchor,
  Group,
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlProps,
  Tabs,
  TabsProps,
  Text,
  ThemeIcon,
  createStyles,
  Badge,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  IconCalendar,
  IconCategory,
  IconDatabase,
  IconHome,
  IconMoneybag,
  TablerIconsProps,
  IconFileDescription,
  IconCircleDot,
  IconTrophy,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { getDisplayName } from '~/utils/string-helpers';

type HomeOption = {
  url: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  highlight?: boolean;
};
const homeOptions: Record<string, HomeOption> = {
  home: {
    url: '/',
    icon: (props: TablerIconsProps) => <IconHome {...props} />,
  },
  // images: {
  //   url: '/images',
  //   icon: (props: TablerIconsProps) => <IconPhoto {...props} />,
  // },
  models: {
    url: '/models',
    icon: (props: TablerIconsProps) => <IconCategory {...props} />,
  },
  // videos: {
  //   url: '/videos',
  //   icon: (props: TablerIconsProps) => <IconVideo {...props} />,
  // },
  // posts: {
  //   url: '/posts',
  //   icon: (props: TablerIconsProps) => <IconLayoutList {...props} />,
  // },
  // articles: {
  //   url: '/articles',
  //   icon: (props: TablerIconsProps) => <IconFileText {...props} />,
  // },
  'data-set': {
    url: '/data-set',
    icon: (props: TablerIconsProps) => <IconFileDescription {...props} />,
  },
  bounties: {
    url: '/bounties',
    icon: (props: TablerIconsProps) => <IconCircleDot {...props} />,
  },
  events: {
    url: '/events',
    icon: (props: TablerIconsProps) => <IconTrophy {...props} />,
  },
  // clubs: {
  //   url: '/clubs',
  //   icon: (props: TablerIconsProps) => <IconClubs {...props} />,
  // },
  // builds: {
  //   url: '/builds',
  //   icon: (props: TablerIconsProps) => <IconCpu {...props} />,
  // },
};
type HomeOptions = keyof typeof homeOptions;

const useStyles = createStyles<string, { hideActive?: boolean }>((_, params) => ({
  label: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 10,
  },
  active: {
    // Manually adjust the active state to match the design
    marginTop: 4,
    marginLeft: 3,
    borderRadius: 0,
    display: params.hideActive ? 'none' : 'block',
  },
  themeIcon: {
    root: {
      backgroundColor: 'transparent',
    },
  },
  root: {
    backgroundColor: 'transparent',
    gap: 8,
    borderRadius: 0,

    '--tw-shadow': 'var(--color-primary-shadow)',
    '--tw-shadow-colored': 'var(--color-primary-shadow)',
    boxShadow:
      'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
    // box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

    [containerQuery.smallerThan('sm')]: {
      overflow: 'auto hidden',
      maxWidth: '100%',
    },
  },
  control: { border: 'none !important' },
}));

export function useHomeSelection() {
  const [home, setHome] = useLocalStorage<HomeOptions>({
    key: 'home-selection',
    defaultValue: 'home',
  });

  const url = homeOptions[home]?.url;
  const set = (value: HomeOptions) => {
    setHome(value);
    return homeOptions[value]?.url;
  };

  return { home, url, set };
}

export function HomeContentToggle({ size, sx, ...props }: Props) {
  const router = useRouter();
  const { set, home } = useHomeSelection();
  const features = useFeatureFlags();
  const activePath = router.pathname.split('/')[1] || 'home';
  console.log('activePath', activePath);
  const { classes, theme } = useStyles({ hideActive: activePath !== home });

  const options: SegmentedControlItem[] = Object.entries(homeOptions).map(([key, value]) => ({
    label: (
      <Link href={value.url} passHref>
        <Anchor variant="text">
          <Group
            align="center"
            spacing={8}
            onClick={() => {
              set(key as HomeOptions);
            }}
            noWrap
          >
            <ThemeIcon size={30} color={'transparent'} p={4}>
              {value.icon({
                color: activePath === key ? theme.colors.omnimuse[4] : theme.colors.omnimuse[5],
              })}
            </ThemeIcon>
            <Text size="sm" transform="capitalize" inline>
              {key}
            </Text>
            {value.highlight && (
              <Badge color="yellow" variant="filled" size="sm" radius="xl">
                New
              </Badge>
            )}
          </Group>
        </Anchor>
      </Link>
    ),
    value: key,
    disabled: [key === 'bounties' && !features.bounties, key === 'clubs' && !features.clubs].some(
      (b) => b
    ),
  }));

  return (
    <SegmentedControl
      {...props}
      sx={(theme) => ({
        ...(typeof sx === 'function' ? sx(theme) : sx),
      })}
      size="md"
      classNames={classes}
      value={activePath}
      data={options.filter((item) => item.disabled === undefined || item.disabled === false)}
    />
  );
}

type Props = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
} & Omit<SegmentedControlProps, 'data' | 'value' | 'onChange'>;

const useTabsStyles = createStyles((theme) => ({
  root: {
    overflow: 'auto hidden',
    height: '56px',
  },
  tab: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 16,
    height: '56px',
    color: theme.colors.omnimuse[5],
    [`&[data-active]`]: {
      color: theme.colors.omnimuse[4],
      position: 'relative',
      borderWidth: 0,
      borderColor: 'transparent',
      '&::after': {
        content: "''",
        position: 'absolute',
        display: 'block',
        width: '100%',
        height: '3px',
        borderRadius: '3px 3px 0 0',
        background:
          'linear-gradient(90deg, rgb(154, 93, 255) 0%, rgb(119, 96, 255) 100%) !important',
        left: 0,
        bottom: 0,
        boxShadow:
          'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(154, 93, 255, 0.6) 0px 0px 15px 2px',
      },
      [`&:hover`]: {
        background: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
      },
    },
    [`&:hover`]: {
      background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
    },
  },
  tabLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  tabsList: {
    backgroundColor: 'transparent',
    gap: 36,
    borderRadius: 0,
    flexWrap: 'nowrap',
    height: '100%',
    border: 0,

    [containerQuery.smallerThan('sm')]: {
      maxWidth: '100%',
    },
  },
}));

export function HomeTabs({ sx, ...tabProps }: HomeTabProps) {
  const router = useRouter();
  const { set } = useHomeSelection();
  const features = useFeatureFlags();
  const activePath = router.pathname.split('/')[1] || 'home';
  const { classes } = useTabsStyles();

  const tabs = Object.entries(homeOptions)
    .filter(
      ([key]) =>
        ![key === 'bounties' && !features.bounties, key === 'clubs' && !features.clubs].some(
          (b) => b
        )
    )
    .map(([key, value]) => (
      <Link key={key} href={value.url} passHref>
        <Anchor variant="text" onClick={() => set(key as HomeOptions)}>
          <Tabs.Tab
            value={key}
            icon={value.icon({ size: 20 })}
            pr={value.highlight ? 10 : undefined}
          >
            <Group spacing={4} noWrap>
              <Text className={classes.tabLabel} inline>
                {getDisplayName(key)}
              </Text>
              {value.highlight && (
                <Badge color="primary.3" variant="filled" size="sm" radius="xl">
                  New
                </Badge>
              )}
            </Group>
          </Tabs.Tab>
        </Anchor>
      </Link>
    ));

  // TODO.homeTabs: make these be a select dropdown on mobile
  return (
    <Tabs
      defaultValue="home"
      {...tabProps}
      sx={(theme) => ({
        ...(typeof sx === 'function' ? sx(theme) : sx),
      })}
      value={activePath}
      classNames={classes}
    >
      <Tabs.List>{tabs}</Tabs.List>
    </Tabs>
  );
}

type HomeTabProps = Omit<TabsProps, 'value' | 'defaultValue' | 'children'>;
