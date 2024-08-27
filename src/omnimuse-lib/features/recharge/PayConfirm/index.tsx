import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Image } from '@mantine/core';
import XButton from '~/omnimuse-lib/components/XButton';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import { IconChevronRight } from '@tabler/icons-react';
import { useDialogContext } from '~/components/Dialog/DialogProvider';
import { abbreviateNumber } from '~/utils/number-helpers';
import { useUserStore } from '~/store/user.store';
import { useDownLoadModel, useWorkAcceptModel, useBuyModel } from './utils';
import { triggerRoutedDialog } from '~/components/Dialog/RoutedDialogProvider';

export type PayType = 'buyModel' | 'downloadModel' | 'payment';

interface PayConfirmModalProps {
  type: PayType;
  contentId: number;
  creditCount: number;
  data?: any;
}

export default function PayConfirmModal({
  type,
  contentId,
  creditCount,
  ...props
}: PayConfirmModalProps) {
  const router = useRouter();
  const dialog = useDialogContext();
  const currentUser = useUserStore((state) => state.userInfo);
  const { handleDownload, downloadUrl, fileName } = useDownLoadModel();
  const { handleWorkAccept } = useWorkAcceptModel();
  const { handleBuyModel } = useBuyModel();
  const [loading, setLoading] = useState(false);
  const configs = useMemo(() => {
    return {
      buyModel: {
        title: 'Buy',
        buttonText: 'Buy',
        tips: `You will spend ${creditCount} points to buy this model`,
      },
      downloadModel: {
        title: 'Download',
        buttonText: 'Get Download Url',
        tips: `You will spend ${creditCount} points to download this model`,
      },
      payment: {
        title: 'Payment',
        buttonText: 'Pay',
        tips: `Do you confirm to pay the bounty for this work to get the download permission of this work`,
      },
    };
  }, [creditCount]);
  const disabled = useMemo(() => {
    if (currentUser?.credit) {
      return currentUser.credit < creditCount;
    }
    return true;
  }, [creditCount, currentUser?.credit]);

  const handleConfirm = async () => {
    setLoading(true);
    if (type === 'downloadModel') {
      // 处理下载模型
      await handleDownload(contentId).finally(() => {
        setLoading(false);
      });
    }
    if (type === 'buyModel') {
      // 处理购买模型
      const flag = await handleBuyModel(props.data).finally(() => {
        setLoading(false);
      });
      if (flag) {
        dialog.onClose();
        router.push(`/user/${currentUser?.id}/model`);
      }
    }
    if (type === 'payment') {
      // 支付
      const flag = await handleWorkAccept(contentId).finally(() => {
        setLoading(false);
      });
      if (flag) {
        dialog.onClose();
      }
    }
  };

  return (
    <MantineModal
      opened={dialog.opened}
      onClose={dialog.onClose}
      title={configs[type].title}
      closeOnClickOutside={false}
      closeOnEscape={false}
      width={757}
    >
      <div className="pt-[50px] px-[50px] flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <Image alt="coin" className="!w-[32px]" src="/images/icon/gold.svg" />
          <span
            title={creditCount + ''}
            className="text-[26px] text-coinText text-nowrap font-medium"
          >
            {abbreviateNumber(Number(creditCount), { decimals: 2 })}
          </span>
        </div>
        <span className="text-defaultText text-sm">{configs[type].tips}</span>
        {downloadUrl ? (
          <a
            className={`text-primaryText mt-[50px] ${
              disabled ? 'mb-[20px]' : 'mb-[80px]'
            }  underline max-w-[360px] truncate`}
            download={fileName}
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
          >
            {fileName}
          </a>
        ) : (
          <XButton
            disabled={disabled}
            loading={loading}
            type="primary"
            className={`${
              disabled ? 'mb-[10px]' : 'mb-[50px]'
            } mt-[50px] !rounded-[40px] w-[388px]`}
            onClick={() => {
              handleConfirm();
            }}
          >
            {configs[type].buttonText}
          </XButton>
        )}
        {disabled && (
          <div className="w-[388px] flex justify-between items-center mb-5 text-xs">
            <span className="text-errorText">Not enough points, please recharge. </span>
            <div
              onClick={() => {
                triggerRoutedDialog({ name: 'topUp', state: {} });
              }}
              className="flex items-center cursor-pointer text-primaryText h-4 gap-0.5"
            >
              <span>Go recharge</span>
              <IconChevronRight size={14} />
            </div>
          </div>
        )}
      </div>
    </MantineModal>
  );
}
