import { useRef, useState } from 'react';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import { useDialogContext } from '~/components/Dialog/DialogProvider';
import { useDebouncedValue } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { Loader } from '@mantine/core';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';
import { Image } from '@mantine/core';
import { userReward } from '~/request/api/user/index';
import { useModelStore } from '~/store/model.store';
export default function Reward({
  amount = 1,
  id,
  type,
}: {
  amount?: string | number;
  id: string | number;
  type: string | number;
}) {
  const { currentUser } = useUserInfo();
  const dialog = useDialogContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultValue = amount.toString();
  const [inputValue, setInputValue] = useState<number | string>(defaultValue);
  const [searchValue] = useDebouncedValue(inputValue, 500);
  const [loading, setLoading] = useState(false);
  // const setRefreshModelTotalCountKey = useModelStore((state) => state.setRefreshModelTotalCountKey);
  const setRewardCount = useModelStore((state) => state.setRewardCount);
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
      }
    }
  };

  const handleExecute = async () => {
    if (loading) {
      return;
    }
    if (Number(inputValue) <= 0) {
      showNotification({
        message: 'Rewards points cannot be set to 0',
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
      const dataParams = {
        amount: inputValue * 1,
        id: id,
        type: type,
      };

      const res = await userReward(dataParams);

      if (res.code === 200) {
        dialog.onClose();
        setRewardCount(res.result.finalCredit);
        showNotification({
          message: 'reward success!',
          color: 'green',
          autoClose: 3000,
        });
        setLoading(false);
      } else {
        setLoading(false);
        showNotification({
          message: res.message,
          color: 'red',
          autoClose: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <MantineModal
      opened={dialog.opened}
      onClose={() => {
        dialog.onClose();
      }}
      title="Reward"
      closeOnClickOutside={false}
      closeOnEscape={false}
      width={757}
    >
      <div className="flex flex-col items-center py-[50px]">
        <div className="w-[336px] flex items-end justify-center mb-4 border-b border-solid border-secondaryBorder">
          <div className="text-defaultText w-full font-semibold mb-2.5 text-center">
            <div className="text-2xl inline-block mr-[5px]">
              <Image src="/images/icon/gold.svg" width="32px" height="32px" alt="gold" />
            </div>
            <input
              ref={inputRef}
              className=" text-[40px] w-[100px] inline-block"
              type="number"
              name="coin_input"
              id="coin_input"
              value={inputValue}
              onChange={(e: any) => {
                setInputValue(e.target?.value);
              }}
              style={{
                background: 'transparent',
                outline: 'none',
                maxWidth: '280px',
                color: '#FFA223',
              }}
              onKeyUp={() => {
                autoFitInputWidth();
              }}
              onBlur={() => {
                handleCheckValue();
              }}
            ></input>
          </div>
        </div>
        <div className="text-sm text-defaultText mb-12">
          <span className="inline-block align-middle">You will pay</span>
          <span className="inline-block align-middle mx-1"> {searchValue} </span>
          <span className="inline-block align-middle">points for this tip</span>
        </div>
        <div
          onClick={() => {
            handleExecute();
          }}
          className="flex items-center justify-center bg-primaryBg rounded-[40px] h-[44px] w-[388px] cursor-pointer text-base font-semibold text-defaultText"
        >
          {loading ? <Loader size="xs" /> : <span>Reward</span>}
        </div>
      </div>
    </MantineModal>
  );
}
