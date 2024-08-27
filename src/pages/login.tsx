import {
  Container,
  Paper,
  Stack,
  Text,
  Alert,
  Group,
  ThemeIcon,
  Image,
  createStyles,
} from '@mantine/core';
import { IconExclamationMark } from '@tabler/icons-react';
import { useRouter } from 'next/router';

import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { Meta } from '~/components/Meta/Meta';
import { env } from '~/env/client.mjs';
import { useLoginAuthentication } from '~/hooks/useLoginAuthentication';
import useEthers from '~/components/ButtonLibrary/WalletButton/useEthers';

const useStyles = createStyles(() => ({
  loginBox: {
    borderColor: '#2B2D30',
    backgroundColor: 'rgba(43, 45, 48, 0.50)',
    borderRadius: '12px',
    padding: '48px 30px',
  },
  loginTitle: {
    color: '#FFF',
    fontFamily: 'PingFang SC',
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '32px',
    marginBottom: '40px',
  },
  loginItem: {
    border: '1px solid #2B2D30',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    height: '56px',
    gap: '14px',
    cursor: 'pointer',
    background: 'rgba(43, 45, 48, 0.50)',
  },
  loginItemTitle: {
    fontFamily: 'PingFang SC',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    color: '#fff',
  },
}));

export default function Login() {
  const router = useRouter();
  const { connectWallet, errorMsg } = useEthers();
  const { initFlag } = useLoginAuthentication(true);
  // @ts-ignore
  const returnUrl = router.query?.returnUrl ? decodeURIComponent(router.query.returnUrl) : '/';
  const { classes } = useStyles();

  if (!initFlag) {
    return <></>;
  }

  return (
    <>
      <Meta
        title="Sign in to OmniMuse"
        links={[{ href: `${env.NEXT_PUBLIC_BASE_URL}/login`, rel: 'canonical' }]}
      />
      <Container size={452} mt={'20vh'}>
        <Stack>
          {!!errorMsg && (
            <Alert color="yellow">
              <Group position="center" spacing="xs" noWrap align="flex-start">
                <ThemeIcon color="yellow">
                  <IconExclamationMark />
                </ThemeIcon>
                <Text size="md">{errorMsg}</Text>
              </Group>
            </Alert>
          )}
          <Paper className={classes.loginBox} withBorder>
            <Text className={classes.loginTitle}>Connect Wallet</Text>

            <Stack spacing={'xl'} mb={errorMsg ? 'md' : undefined}>
              <div
                className={classes.loginItem}
                onClick={() => {
                  connectWallet('metamask', returnUrl);
                }}
              >
                <Image src="/images/wallet/metamask.png" alt="MetaMask" width={24} height={24} />
                <span className={classes.loginItemTitle}>MetaMask</span>
              </div>
              <div
                className={classes.loginItem}
                onClick={() => {
                  connectWallet('okx', returnUrl);
                }}
              >
                <Image src="/images/wallet/okx.png" alt="OKX Wallet" width={24} height={24} />
                <span className={classes.loginItemTitle}>OKX Wallet</span>
              </div>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export const getServerSideProps = createServerSideProps({
  useSession: true,
  resolver: async ({ session }) => {
    if (session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  },
});
