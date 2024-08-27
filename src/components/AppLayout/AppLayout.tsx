import { Button, Center, Stack, Text, ThemeIcon, Title, createStyles } from '@mantine/core';
import { IconBan } from '@tabler/icons-react';
import React from 'react';

import { AppHeader, RenderSearchComponentProps } from '~/components/AppLayout/AppHeader';
import { ContainerProvider } from '~/components/ContainerProvider/ContainerProvider';
import { GenerationSidebar } from '~/components/ImageGeneration/GenerationSidebar';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { ScrollAreaMain } from '~/components/ScrollArea/ScrollAreaMain';
import { SubNav } from '~/components/AppLayout/SubNav';
import { useRouter } from 'next/router';

type AppLayoutProps = {
  innerLayout?: ({ children }: { children: React.ReactNode }) => React.ReactNode;
  withScrollArea?: boolean;
};

export function AppLayout({
  children,
  renderSearchComponent,
  innerLayout,
  withScrollArea = true,
}: {
  children: React.ReactNode;
  renderSearchComponent?: (opts: RenderSearchComponentProps) => React.ReactElement;
} & AppLayoutProps) {
  const InnerLayout: any = innerLayout;
  const { classes } = useStyles();
  const user = useCurrentUser();
  // TODO - move the bannedAt check to _app.tsx
  const isBanned = !!user?.bannedAt;
  const router = useRouter();

  if (isBanned)
    return (
      <Center py="xl">
        <Stack align="center">
          <ThemeIcon size={128} radius={100} color="red">
            <IconBan size={80} />
          </ThemeIcon>
          <Title order={1} align="center">
            You have been banned
          </Title>
          <Text size="lg" align="center">
            This account has been banned and cannot access the site
          </Text>
          <Button
            onClick={() => {
              console.log('退出登录');
            }}
          >
            Sign out
          </Button>
        </Stack>
      </Center>
    );
  // 改布局的话可以参照这些注释的代码进行修改
  // const getContent = () => {
  //   if (['/', '/models', '/events', '/bounties', '/data-set'].includes(router.pathname)) {
  //     return (
  //       <>
  //         <SubNav />
  //         {children}
  //       </>
  //     );
  //   }
  //   if (router.pathname.startsWith('/models/')) {
  //     return (
  //       <>
  //         <SubNav />
  //         {children}
  //       </>
  //     );
  //   }
  //   if (InnerLayout) {
  //     return <InnerLayout>{children}</InnerLayout>;
  //   }
  //   if (withScrollArea) {
  //     return <ScrollAreaMain>{children}</ScrollAreaMain>;
  //   }
  //   return children;
  // };
  // const content = getContent();

  const content = ['/', '/models', '/events', '/bounties', '/data-set'].includes(
    router.pathname
  ) ? (
    <>
      <SubNav />
      {children}
    </>
  ) : InnerLayout ? (
    <InnerLayout>{children}</InnerLayout>
  ) : withScrollArea ? (
    <ScrollAreaMain>{children}</ScrollAreaMain>
  ) : (
    children
  );

  return (
    <>
      <AppHeader fixed={false} renderSearchComponent={renderSearchComponent} />
      <div className={classes.wrapper}>
        <GenerationSidebar />

        <ContainerProvider containerName="main">
          <main className={classes.main}>{content}</main>
        </ContainerProvider>
      </div>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  assistant: {
    position: 'absolute',
    bottom: theme.spacing.xs,
    right: theme.spacing.md,
    display: 'inline-block',
    zIndex: 20,
    width: 42,
  },
}));

export function setPageOptions(Component: (...args: any) => JSX.Element, options?: AppLayoutProps) {
  (Component as any).options = options;
}
