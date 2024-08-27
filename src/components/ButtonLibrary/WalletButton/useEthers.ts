import { ethers } from 'ethers';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import emcABI from './EMC_ABI.json';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';
import { TLoginType } from '~/request/api/user/type';
import { handleEthSignIn, handleGetEthSignData, handleLoginSuccess } from './utils';
import { useUserStore } from '~/store/user.store';

enum WalletTypeEnum {
  okxwallet = 'okxwallet',
  ethereum = 'ethereum',
}

type WalletType = (typeof WalletTypeEnum)[keyof typeof WalletTypeEnum];

type WalletObjKeys = {
  [key in TLoginType]: {
    windowKey: WalletType;
    downloadUrl: string;
  };
};

const emcAddress = '0xdfb8be6f8c87f74295a87de951974362cedcfa30';
const toAddress = '0x08ec3c0f4E85E2a9b61Bbc5E3E3de6fc90E8f23e';

const useEthers = () => {
  const { setAllStoreUserInfo } = useUserInfo();
  const setFlags = useUserStore((state) => state.setFlags);
  const [errorMsg, setErrorMsg] = useState('');

  const getError = (error: string) => {
    setErrorMsg(error);
    return new Error(error);
  };

  const getWallet = (loginType: TLoginType) => {
    const walletObjKeys: WalletObjKeys = {
      okx: {
        windowKey: WalletTypeEnum.okxwallet,
        downloadUrl:
          'https://chromewebstore.google.com/detail/%E6%AC%A7%E6%98%93-web3-%E9%92%B1%E5%8C%85/mcohilncbfahbmgdjkbpemcciiolgcge',
      },
      metamask: {
        windowKey: WalletTypeEnum.ethereum,
        downloadUrl:
          'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      },
    };
    const loginTypes: TLoginType[] = ['okx', 'metamask'];
    if (!loginTypes.includes(loginType)) {
      throw getError('loginType is illegal.');
    }
    const wallet = window[walletObjKeys[loginType].windowKey];
    const downloadUrl = walletObjKeys[loginType].downloadUrl;
    if (!wallet) {
      setTimeout(() => {
        window.open(downloadUrl, '_blank');
      }, 2000);
      throw getError('wallet is not available.');
    }
    return wallet;
  };

  const isWalletConnected = (loginType: TLoginType) => {
    const wallet = getWallet(loginType);
    if (wallet && wallet.selectedAddress) {
      return true;
    }
    return false;
  };

  const getProvider = async (loginType: TLoginType) => {
    const wallet = getWallet(loginType);
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(wallet);
      const connectedFlag = isWalletConnected(loginType);
      if (!connectedFlag) {
        await provider.send('eth_requestAccounts', []);
      }
      return provider;
    } else {
      throw getError('wallet is not available.');
    }
  };

  const getSigner = async (provider: ethers.BrowserProvider) => {
    if (provider) {
      const signer = await provider.getSigner();
      return signer;
    } else {
      throw getError('provider is not found.');
    }
  };

  const getAddress = async (loginType: TLoginType, provider?: ethers.BrowserProvider) => {
    let walletProvider = provider;
    if (!provider) {
      walletProvider = await getProvider(loginType);
    }
    if (!walletProvider) {
      return '';
    }
    const signer = await getSigner(walletProvider);
    return signer.address;
  };

  const switchToArbitrum = async (provider?: ethers.BrowserProvider) => {
    if (provider) {
      const network = await provider.getNetwork();
      // console.log(network.chainId);
      if (network.chainId === BigInt(42161)) {
        return;
      }
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: ethers.toQuantity(42161) }]);
      } catch (switchError: any) {
        if (switchError?.message?.includes(`"code": 4902`)) {
          try {
            await provider.send('wallet_addEthereumChain', [
              {
                chainId: ethers.toQuantity(42161),
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                chainName: 'Arbitrum One',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://arbiscan.io/'],
              },
            ]);
          } catch (addError) {
            throw getError('Failed to add the Arbitrum network');
          }
          return;
        }
        console.error('Failed to switch to the Arbitrum network:', switchError);
      }
    }
  };

  const transferToken = async (signer: ethers.JsonRpcSigner, toAddress: string, amount: string) => {
    const tokenContract = new ethers.Contract(emcAddress, emcABI, signer);
    const amountToTransfer = ethers.parseUnits(amount, 18);

    try {
      const transaction = await tokenContract.transfer(toAddress, amountToTransfer);
      console.log('Transaction hash:', transaction.hash);
      await transaction.wait();
      console.log('Transfer completed');
      return transaction.hash;
    } catch (error: any) {
      if (error?.message?.includes(`estimateGas`)) {
        showNotification({
          message: 'estimateGas is insufficient!',
          color: 'red',
          autoClose: 3000,
        });
      }
      throw getError('Failed to transfer token.');
    }
  };

  const connectWallet = async (loginType: TLoginType, callbackUrl: string) => {
    setErrorMsg('');
    const provider = await getProvider(loginType);
    try {
      const signer = await getSigner(provider);
      const address = signer.address;
      console.log('connected address: ', address);
      await switchToArbitrum(provider);
      const { signData, flag } = await handleGetEthSignData(address);
      if (flag) {
        const signature = (await provider.send('personal_sign', [address, signData])) as string;
        const {
          flag: signFlag,
          loginFlags,
          userInfo,
        } = await handleEthSignIn(signData, signature, loginType);
        if (signFlag && userInfo) {
          setAllStoreUserInfo(userInfo);
          setFlags(loginFlags);
          handleLoginSuccess(callbackUrl);
        }
      }
    } catch (error) {
      getError('Failed to connect wallet.');
    }
  };

  const executeTransfer = async (amount: string, loginType: TLoginType) => {
    try {
      const provider = await getProvider(loginType);
      const signer = await getSigner(provider);
      await switchToArbitrum(provider);
      const res = await transferToken(signer, toAddress, amount);
      return res;
    } catch (error) {
      throw getError('Failed to execute transfer.');
    }
  };

  return {
    connectWallet,
    executeTransfer,
    getAddress,
    toAddress,
    errorMsg,
    setErrorMsg,
  };
};

export default useEthers;
