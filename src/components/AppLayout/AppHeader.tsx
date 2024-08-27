import {
  ActionIcon,
  Anchor,
  Box,
  Burger,
  createStyles,
  Divider,
  Grid,
  Group,
  Header,
  Menu,
  Paper,
  Portal,
  ScrollArea,
  Text,
  Transition,
  Image,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import XButton from '~/omnimuse-lib/components/XButton';
import { triggerRoutedDialog } from '~/components/Dialog/RoutedDialogProvider';
import {
  IconBrush,
  IconChevronDown,
  IconLogout,
  IconCircleDot,
  IconFileDescription,
  IconTrophy,
  IconSearch,
  IconUpload,
  IconUser,
  IconCoins,
} from '@tabler/icons-react';
import WalletUserCard from '~/omnimuse-lib/features/user/WalletUserCard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Fragment,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ContainerProvider } from '~/components/ContainerProvider/ContainerProvider';
import { ListSearch } from '~/components/ListSearch/ListSearch';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';
import { Logo } from '~/components/Logo/Logo';
import UserAvatar from '~/omnimuse-lib/features/user/UserAvatar';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';
import { constants } from '~/server/common/constants';
import { LoginRedirectReason } from '~/utils/login-helpers';
import IntegratedSearch from '../AutocompleteSearch/IntegratedSearch';
import { GenerateButton } from '../RunStrategy/GenerateButton';
import { useUserStore } from '~/store/user.store';
import { abbreviateNumber } from '~/utils/number-helpers';
import { handleSignOut } from '~/request/api/login';

const HEADER_HEIGHT = 80;

const useStyles = createStyles((theme) => ({
  root: {
    containerName: 'header',
    containerType: 'inline-size',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    flexWrap: 'nowrap',
    paddingLeft: theme.spacing.xs * 1.6, // 16px
    paddingRight: theme.spacing.xs * 1.6, // 16px
    background: theme.colors.omnimuse1[0],

    [theme.fn.smallerThan('sm')]: {
      paddingLeft: theme.spacing.xs * 0.8, // 8px
      paddingRight: theme.spacing.xs * 0.8, // 8px
    },
  },

  burger: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  search: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  searchArea: {
    maxWidth: 700,
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  links: {
    display: 'flex',
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('md')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    borderRadius: theme.radius.xl,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  },

  mobileSearchWrapper: {
    height: '100%',
    width: '100%',
  },

  dNone: {
    display: 'none',
  },
}));

type MenuLink = {
  label: ReactNode;
  href: string;
  redirectReason?: LoginRedirectReason;
  visible?: boolean;
  as?: string;
  rel?: string;
};

export function AppHeader({ renderSearchComponent = IntegratedSearch, fixed = true }: Props) {
  const currentUser = useUserStore((state) => state.userInfo);
  const { classes, cx, theme } = useStyles();
  const router = useRouter();
  const features = useFeatureFlags();
  const [burgerOpened, setBurgerOpened] = useState(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const isMuted = currentUser?.muted ?? false;
  const hasPermission = currentUser?.isSystem == 1;

  const mainActions = useMemo<MenuLink[]>(
    () => [
      {
        href: '/generate',
        visible: !isMuted,
        label: (
          <Group align="center" spacing="xs">
            <IconBrush stroke={2} size={18} color={theme.colors.omnimuse[5]} />
            Generate images
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/models/create',
        visible: !isMuted,
        redirectReason: 'upload-model',
        label: (
          <Group align="center" spacing="xs">
            <IconUpload stroke={2} size={18} color={theme.colors.omnimuse[5]} />
            Upload a model
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/bounties/create',
        visible: !isMuted,
        redirectReason: 'create-bounty',
        label: (
          <Group align="center" spacing="xs">
            <IconCircleDot stroke={2} size={18} color={theme.colors.omnimuse[5]} />
            <Text>Create a bounty</Text>
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/data-set/create',
        visible: !isMuted,
        label: (
          <Group align="center" spacing="xs">
            <IconFileDescription stroke={2} size={18} color={theme.colors.omnimuse[5]} />
            <Text>Create Data Set</Text>
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/events/createEvent',
        visible: hasPermission,
        label: (
          <Group align="center" spacing="xs">
            <IconTrophy stroke={2} size={18} color={theme.colors.omnimuse[5]} />
            Create a event
          </Group>
        ),
        rel: 'nofollow',
      },
    ],
    [features.bounties, isMuted, hasPermission, theme]
  );
  const links = useMemo<MenuLink[]>(
    () => [
      {
        href: `/user/${currentUser?.id}`,
        visible: !!currentUser,
        label: (
          <Group align="center" spacing="xs">
            <IconUser stroke={2} size={18} color={theme.colors.omnimuse[5]} />
            Your profile
          </Group>
        ),
      },
    ],
    [currentUser, theme.colors.omnimuse]
  );

  const burgerMenuItems = useMemo(
    () =>
      mainActions
        .concat([{ href: '', label: <Divider /> }, ...links])
        .filter(({ visible }) => visible !== false)
        .map((link, index) => {
          const item = link.href ? (
            <Link key={index} href={link.href} as={link.as} passHref>
              <Anchor
                variant="text"
                className={cx(classes.link, { [classes.linkActive]: router.asPath === link.href })}
                onClick={() => setBurgerOpened(false)}
                rel={link.rel}
              >
                {link.label}
              </Anchor>
            </Link>
          ) : (
            <Fragment key={`separator-${index}`}>{link.label}</Fragment>
          );

          return link.redirectReason ? (
            <LoginRedirect key={link.href} reason={link.redirectReason} returnUrl={link.href}>
              {item}
            </LoginRedirect>
          ) : (
            item
          );
        }),
    [classes, setBurgerOpened, cx, links, mainActions, router.asPath]
  );
  const userMenuItems = useMemo(
    () =>
      links
        .filter(({ visible }) => visible !== false)
        .map((link, index) =>
          link.href ? (
            <Menu.Item
              key={link.href}
              display="flex"
              component={NextLink}
              href={link.href}
              as={link.as}
              rel={link.rel}
              className="text-secondaryText font-semibold px-4 py-3"
            >
              {link.label}
            </Menu.Item>
          ) : (
            <Fragment key={`separator-${index}`}>{link.label}</Fragment>
          )
        ),
    [links]
  );
  const [showSearch, setShowSearch] = useState(false);
  const onSearchDone = () => setShowSearch(false);

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus(); // Automatically focus input on mount
    }
  }, [showSearch]);

  const mobileCreateButton = !isMuted && (
    <GenerateButton
      variant="light"
      py={8}
      px={12}
      h="auto"
      radius="sm"
      compact
      className="show-mobile"
      data-activity="create:navbar"
    />
  );

  const createMenu = !isMuted && (
    <Menu
      position="bottom-end"
      transition="pop-top-right"
      trigger="hover"
      openDelay={400}
      zIndex={constants.imageGeneration.drawerZIndex + 2}
      withinPortal
    >
      <Menu.Target>
        <Group
          spacing={0}
          noWrap
          className="hide-mobile"
          sx={(theme) => ({
            height: '44px',
            paddingRight: '14px',
            color: theme.white,
            borderRadius: theme.radius.md,
            background: `linear-gradient(${theme.defaultGradient.deg}deg, ${theme.defaultGradient.from} 0%, ${theme.defaultGradient.to} 100%)`,
            ':hover': {
              backgroundSize: '200%',
            },
          })}
        >
          <GenerateButton
            variant={undefined}
            h="auto"
            radius="sm"
            className="pl-[14px] pr-2"
            // Quick hack to avoid svg from going over the button. cc: Justin 👀
            sx={() => ({ borderTopRightRadius: 0, borderBottomRightRadius: 0 })}
            compact
            data-activity="create:navbar"
          />
          <IconChevronDown stroke={2} size={20} />
        </Group>
      </Menu.Target>
      <Menu.Dropdown>
        {mainActions
          .filter(({ visible }) => visible !== false)
          .map((link) => {
            const menuItem = (
              <Menu.Item
                key={link.href}
                component={NextLink}
                href={link.href}
                as={link.as}
                rel={link.rel}
              >
                {link.label}
              </Menu.Item>
            );

            return menuItem;
          })}
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <ContainerProvider
      component={Header}
      height={HEADER_HEIGHT}
      fixed={fixed}
      zIndex={100}
      containerName="header"
    >
      <Box className={cx(classes.mobileSearchWrapper, { [classes.dNone]: !showSearch })}>
        {renderSearchComponent({ onSearchDone, isMobile: true, ref: searchRef })}
      </Box>

      <Grid
        className={cx(classes.header, { [classes.dNone]: showSearch })}
        pl={40}
        pr={40}
        m={0}
        gutter="xl"
        align="center"
      >
        {/* 项目logo模块 */}
        <Grid.Col span="auto" p={0}>
          <Group spacing="xs" noWrap>
            <Anchor
              component={NextLink}
              href="/"
              variant="text"
              onClick={() => setBurgerOpened(false)}
            >
              <Logo />
            </Anchor>
          </Group>
        </Grid.Col>
        {/* 搜索模块 */}
        <Grid.Col
          span={6}
          p={0}
          className={features.enhancedSearch ? classes.searchArea : undefined}
        >
          {features.enhancedSearch ? (
            <>{renderSearchComponent({ onSearchDone, isMobile: false })}</>
          ) : (
            <ListSearch onSearch={() => setBurgerOpened(false)} />
          )}
        </Grid.Col>
        <Grid.Col span="auto" p={0} className={classes.links} sx={{ justifyContent: 'flex-end' }}>
          <Group spacing="md" align="center" noWrap>
            {/* Create按钮和相关菜单 */}
            <>
              {mobileCreateButton}
              {createMenu}
            </>
            {/* 用户头像、登录、菜单模块 */}
            {!currentUser ? (
              <XButton type="default" size="md" className="text-base">
                <NextLink href={`/login?returnUrl=${router.asPath}`}> Sign In</NextLink>
              </XButton>
            ) : (
              <Menu
                width={220}
                opened={userMenuOpened}
                position="bottom-end"
                transition="pop-top-right"
                zIndex={constants.imageGeneration.drawerZIndex + 1}
                onClose={() => setUserMenuOpened(false)}
                withinPortal
              >
                <Menu.Target>
                  <XButton
                    onClick={() => setUserMenuOpened(true)}
                    innerClassName="flex items-center"
                    type="default"
                    size="md"
                  >
                    <>
                      <UserAvatar src={currentUser?.image} size="sm" />
                      <div className="w-[1px] h-5 bg-divideBorder mx-3"></div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          triggerRoutedDialog({ name: 'topUp', state: {} });
                        }}
                        className="flex items-center gap-1"
                      >
                        <Image alt="coin" className="w-[18px]" src="/images/icon/gold.svg" />
                        <span
                          title={currentUser?.credit + ''}
                          className="text-base text-coinText font-medium"
                        >
                          {abbreviateNumber(currentUser?.credit, { decimals: 2 })}
                        </span>
                      </div>
                    </>
                  </XButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <ScrollArea.Autosize
                    maxHeight="calc(90vh - var(--mantine-header-height))"
                    styles={{ root: { margin: -4 }, viewport: { padding: 4 } }}
                    offsetScrollbars
                  >
                    <div className="px-3 pt-3.5">
                      <WalletUserCard />
                    </div>
                    <Divider mt={16} mb={8} />
                    <Menu.Item
                      className="text-secondaryText font-semibold px-4 py-3"
                      icon={<IconCoins size={18} stroke={2} />}
                      onClick={() => {
                        triggerRoutedDialog({ name: 'creditsDetail', state: {} });
                      }}
                    >
                      Credits detail
                    </Menu.Item>
                    {userMenuItems}
                    {currentUser && (
                      <Menu.Item
                        className="text-secondaryText font-semibold px-4 py-3"
                        icon={<IconLogout size={18} stroke={2} />}
                        onClick={handleSignOut}
                      >
                        Logout
                      </Menu.Item>
                    )}
                  </ScrollArea.Autosize>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Grid.Col>
        <Grid.Col span="auto" className={classes.burger}>
          <Group spacing={4} noWrap>
            {mobileCreateButton}
            {features.enhancedSearch && (
              <ActionIcon onClick={() => setShowSearch(true)}>
                <IconSearch />
              </ActionIcon>
            )}
            <Burger
              opened={burgerOpened}
              onClick={() => setBurgerOpened(!burgerOpened)}
              size="sm"
            />
            <Transition transition="scale-y" duration={200} mounted={burgerOpened}>
              {(styles) => (
                <Portal>
                  <Paper
                    className={classes.dropdown}
                    withBorder
                    shadow="md"
                    style={{ ...styles, borderLeft: 0, borderRight: 0 }}
                    radius={0}
                  >
                    {/* Calculate maxHeight based off total viewport height minus header + footer + static menu options inside dropdown sizes */}
                    <ScrollArea.Autosize maxHeight={'calc(100dvh - 135px)'}>
                      {burgerMenuItems}
                    </ScrollArea.Autosize>

                    <Group p="md" position="apart" grow>
                      {currentUser && (
                        <>
                          <ActionIcon variant="default" onClick={() => handleSignOut()} size="lg">
                            <IconLogout
                              stroke={2}
                              color={theme.colors.red[theme.fn.primaryShade()]}
                            />
                          </ActionIcon>
                        </>
                      )}
                    </Group>
                  </Paper>
                </Portal>
              )}
            </Transition>
          </Group>
        </Grid.Col>
      </Grid>
    </ContainerProvider>
  );
}

type Props = {
  renderSearchComponent?: (opts: RenderSearchComponentProps) => ReactElement;
  fixed?: boolean;
};
export type RenderSearchComponentProps = {
  onSearchDone?: () => void;
  isMobile: boolean;
  ref?: RefObject<HTMLInputElement>;
};
