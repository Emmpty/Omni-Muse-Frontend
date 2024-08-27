import { useRef, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Decimal from 'decimal.js';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import { useDialogContext } from '~/components/Dialog/DialogProvider';
import useEthers from '~/components/ButtonLibrary/WalletButton/useEthers';
import { useDebouncedValue } from '@mantine/hooks';
import { getEmcUsdtPrice, rechargeCredits } from '~/request/api/credit';
import { showNotification } from '@mantine/notifications';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';
import XButton from '~/omnimuse-lib/components/XButton';

export default function PayModal({
  isCustom = false,
  value = 1,
  credits,
}: {
  isCustom: boolean;
  value?: number;
  credits?: number;
}) {
  const { currentUser, setAllStoreUserInfo } = useUserInfo();
  const { executeTransfer, getAddress, toAddress } = useEthers();
  const dialog = useDialogContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultValue = value.toString();
  const [inputValue, setInputValue] = useState(defaultValue);
  const [creditsCount, setCreditsCount] = useState(credits || 0);
  const [searchValue] = useDebouncedValue(inputValue, 500);
  const [emcCount, setEmcCount] = useState('0');
  const [loading, setLoading] = useState(false);

  const isValidNumber = (value: string) => {
    const pattern = /^(?!0+(\.0+)?$)\d+(\.\d+)?$/;
    return pattern.test(value) && parseFloat(value) >= 1;
  };

  const autoFitInputWidth = () => {
    if (inputRef.current) {
      inputRef.current.style.width = inputRef.current?.value?.length * 26 + 30 + 'px';
      if (inputRef.current?.value?.length > 12) {
        inputRef.current.style.paddingLeft = '24px';
      } else {
        inputRef.current.style.paddingLeft = '0px';
      }
    }
  };

  const handleCheckValue = () => {
    if (inputRef.current) {
      if (!isValidNumber(inputValue)) {
        setInputValue(defaultValue);
        inputRef.current.style.width = '56px';
        setCreditsCount(1000);
      } else {
        setCreditsCount(Number(inputValue) * 1000);
      }
    }
  };

  const handleExecute = async () => {
    if (loading) {
      return;
    }
    if (Number(emcCount) <= 0) {
      showNotification({
        message: 'emc count can not less than 0.',
        color: 'red',
        autoClose: 3000,
      });
      return;
    }
    if (!currentUser?.loginType) {
      showNotification({
        message: 'loginType is not found.',
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const transactionHash = await executeTransfer(emcCount, currentUser?.loginType);
      if (transactionHash) {
        const address = await getAddress(currentUser?.loginType);
        const res = await rechargeCredits({
          from: ethers.getAddress(address),
          to: ethers.getAddress(toAddress),
          transactionHash,
          usd: String(inputValue),
          emc: String(emcCount),
          credits: String(creditsCount),
        }).finally(() => {
          setLoading(false);
        });
        if (res.code === 200) {
          dialog.onClose();
          setAllStoreUserInfo({ credit: res.result });
          showNotification({
            message: 'recharge credits successed!',
            color: 'green',
            autoClose: 3000,
          });
        } else {
          showNotification({
            message: 'recharge credits failed!',
            color: 'red',
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getEmcCount = async (value: string) => {
    const res = await getEmcUsdtPrice();
    if (res.code === 200) {
      const price = Number(value);
      const rate = Number(res.result) / 1000000;
      const count = new Decimal(price).dividedBy(rate);
      setEmcCount(count.toFixed(6));
    }
  };

  useEffect(() => {
    if (isValidNumber(searchValue)) {
      getEmcCount(searchValue);
    } else {
      setEmcCount('0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <MantineModal
      opened={dialog.opened}
      onClose={() => {
        // if (loading) {
        //   return;
        // }
        dialog.onClose();
      }}
      title="Pay"
      closeOnClickOutside={false}
      closeOnEscape={false}
      width={757}
    >
      <div className="flex flex-col items-center py-[50px]">
        {isCustom ? (
          <div className="w-[336px] flex items-end justify-center mb-4 border-b border-solid border-secondaryBorder">
            <div className="text-defaultText font-semibold mb-2.5 relative">
              <div className="text-2xl absolute left-0 bottom-0">$</div>
              <input
                ref={inputRef}
                className="text-center text-[40px] w-14"
                type="number"
                name="coin_input"
                id="coin_input"
                value={inputValue}
                onChange={(e: any) => {
                  setInputValue(e.target?.value);
                }}
                style={{ background: 'transparent', outline: 'none', maxWidth: '336px' }}
                onKeyUp={() => {
                  autoFitInputWidth();
                }}
                onBlur={() => {
                  handleCheckValue();
                }}
              ></input>
            </div>
          </div>
        ) : (
          <div className="text-defaultText text-[40px] font-semibold mb-7">
            <span className="text-2xl">$</span>
            {value}
          </div>
        )}
        <div className="text-sm text-defaultText mb-12">
          <span>You will pay</span>
          <span className="text-coinText"> {emcCount} </span>
          <span>EMC to get {creditsCount} credits</span>
        </div>
        <XButton
          onClick={() => {
            handleExecute();
          }}
          loading={loading}
          type="primary"
          size="md"
          className="!rounded-[40px] w-[388px] justify-center"
          innerClassName="!w-auto"
        >
          <span>Pay EMC</span>
        </XButton>
      </div>
    </MantineModal>
  );
}
