import { createStyles, useMantineTheme } from '@mantine/core';
import React, { useEffect } from 'react';
import { ContainerProvider } from '~/components/ContainerProvider/ContainerProvider';
import { handleSignOut } from '~/request/api/login';
import socket, { WS } from '~/request/websocket';
import { useUserLocalStore } from '~/store/local';
import { useUserStore } from '~/store/user.store';

export function BaseLayout({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const currentUser = useUserStore((state) => state.userInfo);
  const { setAllStoreUserInfo } = useUserLocalStore();

  const updateUserInfo = (message: any) => {
    if (message.type === 'CreditChange') {
      const credit = message.payload.credit;
      if (credit) {
        setAllStoreUserInfo({ credit });
      }
    }
  };
  useEffect(() => {
    if (currentUser?.token) {
      WS.open();
      socket.subscribe((message: any) => updateUserInfo(message));
    }
  }, [currentUser?.token]);
  const handleAccountsChanged = async () => {
    if (currentUser?.loginType === 'okx' && window.okxwallet) {
      const selectedAddress = window.okxwallet.selectedAddress;
      window.okxwallet.on('accountsChanged', (accounts: string[]) => {
        console.log('授权账户: ', accounts);
        console.log(selectedAddress);
        if (accounts.length && selectedAddress !== accounts[0]) {
          handleSignOut();
        }
      });
    }
    if (currentUser?.loginType === 'metamask' && window.ethereum) {
      const selectedAddress = window.ethereum.selectedAddress;
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        console.log('授权账户: ', accounts);
        if (accounts.length && selectedAddress !== accounts[0]) {
          handleSignOut();
        }
        console.log(selectedAddress);
      });
    }
  };
  useEffect(() => {
    handleAccountsChanged();
  }, [currentUser?.loginType]);
  return (
    <ContainerProvider
      className={cx(`theme-${theme.colorScheme}`, classes.root)}
      id="root"
      containerName="root"
      supportsContainerQuery={false}
    >
      {children}
    </ContainerProvider>
  );
}

const useStyles = createStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
}));
