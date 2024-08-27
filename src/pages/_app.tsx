import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { getCookie, getCookies, setCookie } from 'cookies-next';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import type { NextPage } from 'next';
import PlausibleProvider from 'next-plausible';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import Head from 'next/head';
import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { AppLayout } from '~/components/AppLayout/AppLayout';
import { BaseLayout } from '~/components/AppLayout/BaseLayout';
import { BrowserRouterProvider } from '~/components/BrowserRouter/BrowserRouterProvider';
import { ProjectSessionProvider } from '~/components/CivitaiWrapped/ProjectSessionProvider';
import { DialogProvider } from '~/components/Dialog/DialogProvider';
import { RoutedDialogProvider } from '~/components/Dialog/RoutedDialogProvider';
import { MetaPWA } from '~/components/Meta/MetaPWA';
import { RecaptchaWidgetProvider } from '~/components/Recaptcha/RecaptchaWidget';
import { RouterTransition } from '~/components/RouterTransition/RouterTransition';
import { CivitaiPosthogProvider } from '~/hooks/usePostHog';
import { ActivityReportingProvider } from '~/providers/ActivityReportingProvider';
import { CookiesProvider } from '~/providers/CookiesProvider';
import { CustomModalsProvider } from '~/providers/CustomModalsProvider';
import { FeatureFlagsProvider } from '~/providers/FeatureFlagsProvider';
import { FiltersProvider } from '~/providers/FiltersProvider';
import { HiddenPreferencesProvider } from '~/components/HiddenPreferences/HiddenPreferencesProvider';
import { IsClientProvider } from '~/providers/IsClientProvider';

import { RegisterCatchNavigation } from '~/store/catch-navigation.store';
import { ClientHistoryStore } from '~/store/ClientHistoryStore';
import '~/styles/globals.css';
import { BrowsingModeProvider } from '~/components/BrowsingLevel/BrowsingLevelProvider';
import { ParsedCookies, parseCookies } from '~/shared/utils';
import { loginFlags } from '~/store/user.store';
import { trpc } from '~/utils/trpc';
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(minMax);
dayjs.extend(relativeTime);
dayjs.extend(utc);

type CustomNextPage = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  options?: Record<string, unknown>;
};

type CustomAppProps = {
  Component: CustomNextPage;
} & AppProps<{
  colorScheme: ColorScheme;
  cookies: ParsedCookies;
}>;

function MyApp(props: CustomAppProps) {
  const {
    Component,
    pageProps: { colorScheme: initialColorScheme, cookies, ...pageProps },
  } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme | undefined>(initialColorScheme);

  const toggleColorScheme = useCallback(
    (value?: ColorScheme) => {
      const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
      setColorScheme(nextColorScheme);
      setCookie('mantine-color-scheme', nextColorScheme, {
        expires: dayjs().add(1, 'year').toDate(),
      });
    },
    [colorScheme]
  );

  useEffect(() => {
    if (colorScheme === undefined && typeof window !== 'undefined') {
      const osColor = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      setColorScheme(osColor);
    }
  }, [colorScheme]);

  const getLayout = useMemo(
    () =>
      Component.getLayout ??
      ((page: React.ReactElement) => <AppLayout {...Component.options}>{page}</AppLayout>),
    [Component.getLayout, Component.options]
  );

  return (
    <>
      <Head>
        <title>Omnimuse | Share your models</title>
        <MetaPWA />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme ?? 'dark'}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{
            fontFamily:
              'PingFang SC, Microsoft YaHei, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif',
            colorScheme,
            components: {
              Divider: {
                styles: () => ({
                  root: {
                    borderTopColor: '#2D2D2D !important', // 自定义颜色
                  },
                }),
              },
              DatePicker: {
                styles: (theme) => ({
                  root: {
                    daySelected: {
                      backgroundColor: theme.colors.primary[4],
                    },
                  },
                }),
              },
              Modal: {
                styles: (theme) => ({
                  modal: {
                    maxWidth: '100%',
                    color: theme.colors.omnimuse[4],
                    backgroundColor: theme.colors.omnimuse[9],
                    borderRadius: 12,
                  },
                  title: {
                    fontWeight: 600,
                  },
                  close: {
                    color: theme.colors.omnimuse[5],
                    fontSize: 20,
                  },
                  inner: { paddingLeft: 0, paddingRight: 0 },
                }),
              },
              Drawer: {
                styles: {
                  drawer: {
                    containerName: 'drawer',
                    containerType: 'inline-size',
                    display: 'flex',
                    flexDirection: 'column',
                  },
                  body: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
                  header: { margin: 0 },
                },
              },
              Tooltip: {
                defaultProps: { withArrow: true },
              },
              Popover: { styles: { dropdown: { maxWidth: '100vw' } } },
              Rating: { styles: { symbolBody: { cursor: 'pointer' } } },
              Switch: {
                styles: {
                  body: { verticalAlign: 'top' },
                  track: { cursor: 'pointer' },
                  label: { cursor: 'pointer' },
                },
              },
              Radio: {
                styles: {
                  radio: { cursor: 'pointer' },
                  label: { cursor: 'pointer' },
                },
              },
              Badge: {
                styles: { leftSection: { lineHeight: 1 } },
                defaultProps: { radius: 'sm' },
              },
              Checkbox: {
                styles: {
                  input: { cursor: 'pointer' },
                  label: { cursor: 'pointer' },
                },
              },
              Menu: {
                styles: (theme) => ({
                  itemLabel: { display: 'flex' },
                  dropdown: {
                    backgroundColor: theme.colors.omnimuse[2],
                    borderRadius: '8px',
                    border: 'none',
                  },
                }),
              },
              Button: {
                styles: (theme) => ({
                  root: {
                    borderRadius: theme.radius.md,
                    color: theme.white,
                    // border: 'none',
                    '&[button-type="primary"]': {
                      background: `linear-gradient(${theme.defaultGradient.deg}deg, ${theme.defaultGradient.from} 0%, ${theme.defaultGradient.to} 100%)`,
                    },
                    '&[button-type="dark-info"]': {
                      color: '#fff',
                      background: `rgba(43, 45, 48, 0.50)`,
                    },
                    '&[button-type="warning"]': {
                      background: `linear-gradient(${theme.defaultGradient.deg}deg, ${theme.colors.yellow[5]} 0%, ${theme.colors.yellow[7]} 100%)`,
                    },
                    '&[button-type="danger"]': {
                      background: `linear-gradient(${theme.defaultGradient.deg}deg, ${theme.colors.red[5]} 0%, ${theme.colors.red[7]} 100%)`,
                    },
                  },
                }),
              },
              Input: {
                styles: (theme) => ({
                  input: {
                    '&:focus': {
                      borderColor: theme.colors.omnimuse[1],
                    },
                  },
                }),
              },
              Select: {
                defaultProps: {},
                styles: (theme) => ({
                  item: {
                    '&[data-selected]': {
                      backgroundColor: theme.colors.omnimuse[0],
                    },
                    '&[data-selected][data-hovered]': {
                      backgroundColor: theme.colors.omnimuse[0],
                    },
                    // '&:not([data-selected])[data-hovered]': {
                    //   backgroundColor: theme.colors.omnimuse[1],
                    // },
                  },
                  dropdown: {
                    backgroundColor: theme.colors.omnimuse[2],
                    borderRadius: '8px',
                  },
                }),
              },
              Loader: {
                defaultProps: (theme) => ({
                  color: theme.colors.omnimuse[0],
                }),
              },
              Title: {
                styles: (theme) => ({
                  root: {
                    color: theme.colors.omnimuse[4],
                  },
                }),
              },
              Spoiler: {
                styles: (theme) => ({
                  root: {},
                  control: {
                    color: theme.colors.omnimuse[0],
                    fontSize: 16,
                    fontWeight: 600,
                  },
                }),
              },
              Header: {
                styles: (theme) => ({
                  root: {
                    backgroundColor: theme.colors.omnimuse1[0],
                  },
                }),
              },
              Carousel: {
                styles: () => ({
                  control: {
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    boxShadow: 'none',
                    opacity: 1,
                  },
                }),
              },
            },
            colors: {
              primary: [
                '#f4eaff',
                '#e2cfff',
                '#c19cff',
                '#9f64ff',
                '#8137fe',
                '#6f19fe',
                '#6609ff',
                '#5500e4',
                '#4b00cc',
                '#3f00b3',
              ],
              accent: [
                '#F4F0EA',
                '#E8DBCA',
                '#E2C8A9',
                '#E3B785',
                '#EBA95C',
                '#FC9C2D',
                '#E48C27',
                '#C37E2D',
                '#A27036',
                '#88643B',
              ],
              success: [
                '#9EC3B8',
                '#84BCAC',
                '#69BAA2',
                '#4CBD9C',
                '#32BE95',
                '#1EBD8E',
                '#299C7A',
                '#2F826A',
                '#326D5C',
                '#325D51',
              ],
              omnimuse: [
                '#9a5dff',
                '#7760ff',
                '#161718',
                '#000',
                '#fff',
                '#9b9c9e',
                'rgba(43, 45, 48, 0.50)',
                '#2b2b2b',
                '#2d2b30',
                '#1d1d1d',
              ],
              omnimuse1: ['rgba(0, 0, 0, 0.5)'],
            },
            white: '#fefefe',
            black: '#222',
            other: {
              fadeIn: `opacity 200ms ease-in`,
            },
            defaultGradient: {
              from: '#9A5DFF',
              to: '#7760FF',
              deg: 90,
            },
            respectReducedMotion: true,
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <PlausibleProvider
            domain="omnimuse.com"
            customDomain="https://analytics.omnimuse.com"
            selfHosted
          >
            <IsClientProvider>
              <ClientHistoryStore />
              <RegisterCatchNavigation />
              <RouterTransition />
              <FeatureFlagsProvider flags={loginFlags}>
                <CookiesProvider value={cookies}>
                  <BrowsingModeProvider>
                    <ProjectSessionProvider>
                      <ActivityReportingProvider>
                        <CivitaiPosthogProvider>
                          <FiltersProvider>
                            <HiddenPreferencesProvider>
                              <NotificationsProvider zIndex={9999} position={'top-right'}>
                                <BrowserRouterProvider>
                                  <RecaptchaWidgetProvider>
                                    <BaseLayout>
                                      <CustomModalsProvider>
                                        {getLayout(<Component {...pageProps} />)}
                                        <DialogProvider />
                                        <RoutedDialogProvider />
                                      </CustomModalsProvider>
                                    </BaseLayout>
                                  </RecaptchaWidgetProvider>
                                </BrowserRouterProvider>
                              </NotificationsProvider>
                            </HiddenPreferencesProvider>
                          </FiltersProvider>
                        </CivitaiPosthogProvider>
                      </ActivityReportingProvider>
                    </ProjectSessionProvider>
                  </BrowsingModeProvider>
                </CookiesProvider>
              </FeatureFlagsProvider>
            </IsClientProvider>
          </PlausibleProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const initialProps = await App.getInitialProps(appContext);
  // const url = appContext.ctx?.req?.url;
  // const isClient = !url || url?.startsWith('/_next/data');

  const { pageProps, ...appProps } = initialProps;
  const colorScheme = getCookie('mantine-color-scheme', appContext.ctx) ?? 'dark';
  const cookies = getCookies(appContext.ctx);
  const parsedCookies = parseCookies(cookies);
  return {
    pageProps: {
      ...pageProps,
      colorScheme,
      cookies: parsedCookies,
    },
    ...appProps,
  };
};

// export default MyApp;
export default trpc.withTRPC(MyApp);
