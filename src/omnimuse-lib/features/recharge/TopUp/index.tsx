import { useEffect, useMemo, useState } from 'react';
import { Loader } from '@mantine/core';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import { Image } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useDialogContext } from '~/components/Dialog/DialogProvider';
import { triggerRoutedDialog } from '~/components/Dialog/RoutedDialogProvider';
import { useUserStore } from '~/store/user.store';
import { abbreviateNumber } from '~/utils/number-helpers';
import { ICreditPackage } from '~/request/api/credit/type';
import { getPackages } from '~/request/api/credit';

interface TopUpCardProps {
  title: string;
  id: number;
  originalPrice?: string;
  discountPrice: string;
  credits: string;
  isCustom?: boolean;
  activeKey?: number;
  setActiveKey?: (id: number) => void;
}
const TopUpCard = ({
  title,
  id,
  originalPrice,
  discountPrice,
  credits,
  isCustom = false,
  activeKey,
  setActiveKey,
}: TopUpCardProps) => {
  const classConfigs = useMemo(() => {
    return id === activeKey
      ? {
          box: 'border-primaryBorder bg-primaryBg mb-2.5',
          button: 'text-primaryText bg-reverstBg',
        }
      : {
          box: 'border-secondaryBorder bg-secondaryBg mt-2.5',
          button: 'text-defaultText bg-primaryBg',
        };
  }, [id, activeKey]);
  return (
    <div
      onClick={() => {
        setActiveKey?.(id);
      }}
      className={`group border border-solid rounded-xl p-5 ${classConfigs.box}`}
    >
      <div className={`text-defaultText text-sm ${originalPrice ? 'mb-[30px]' : 'mb-[50px]'}`}>
        {title}
      </div>
      <div className="text-center">
        {originalPrice && (
          <div className="line-through text-xs text-defaultText mb-1 opacity-60">
            ${originalPrice}
          </div>
        )}
        <div className="text-defaultText font-semibold text-3xl mb-4">${discountPrice}</div>
        <div className="text-sm text-defaultText font-semibold mb-6 opacity-80">
          {credits} Credits
        </div>
        <div
          onClick={() => {
            triggerRoutedDialog({
              name: 'pay',
              state: { isCustom, value: Number(discountPrice), credits: Number(credits) },
            });
          }}
          className={`flex items-center cursor-pointer text-nowrap rounded-[20px] text-sm font-semibold h-10 px-[45px] ${classConfigs.button}`}
        >
          Redeem now
        </div>
      </div>
    </div>
  );
};

export default function TopUpModal() {
  const dialog = useDialogContext();
  const currentUser = useUserStore((state) => state.userInfo);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ICreditPackage[]>([]);
  const [activeKey, setActiveKey] = useState(0);
  const handleGetData = async () => {
    setLoading(true);
    const res = await getPackages().finally(() => {
      setLoading(false);
    });
    if (res.code === 200) {
      setData(res.result);
      setActiveKey(res?.result?.[1]?.id);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <MantineModal
      opened={dialog.opened}
      onClose={dialog.onClose}
      title="Top-up"
      closeOnClickOutside={false}
      closeOnEscape={false}
      width={757}
    >
      <div className="pt-5 pb-[30px] px-[30px]">
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm flex items-center w-full">
            <div className="text-nowrap text-secondaryText mr-1.5">Residual integral:</div>
            <div className="flex items-center gap-1.5 flex-1">
              <Image alt="coin" className="!w-[18px]" src="/images/icon/gold.svg" />
              <div
                title={currentUser?.credit + ''}
                className="text-coinText font-medium whitespace-normal"
              >
                {abbreviateNumber(currentUser?.credit, { decimals: 2 })}
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              triggerRoutedDialog({ name: 'tradeHistory', state: {} });
            }}
            className="flex items-center gap-1 text-primaryText text-sm font-semibold cursor-pointer"
          >
            <span className="text-nowrap">Exchange records</span>
            <IconChevronRight size={20} />
          </div>
        </div>
        <div className="flex gap-5 justify-center">
          {data.map((item, idx) => {
            return (
              <TopUpCard
                {...item}
                key={item.title}
                setActiveKey={setActiveKey}
                activeKey={activeKey}
              />
            );
          })}
          <TopUpCard
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            title="Custom"
            isCustom={true}
            discountPrice={'1'}
            credits={'1000'}
            id={0}
          />
        </div>
      </div>
    </MantineModal>
  );
}
