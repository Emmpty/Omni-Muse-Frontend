import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import { useDialogContext } from '~/components/Dialog/DialogProvider';
import { ICreditRecord } from '~/request/api/credit/type';
import { getCreditRecords } from '~/request/api/credit';
import { formatDate } from '~/utils/date-helpers';

export default function CreditsDetailModal() {
  const dialog = useDialogContext();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<ICreditRecord[]>([]);
  const getList = async () => {
    setLoading(true);
    const res = await getCreditRecords([1, 2, 3, 4, 5, 6, 7, 8, 9]).finally(() => {
      setLoading(false);
    });
    if (res.code === 200) {
      setList(res.result);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <MantineModal
      opened={dialog.opened}
      onClose={dialog.onClose}
      title="Credits Detail"
      closeOnClickOutside={false}
      closeOnEscape={false}
      width={757}
    >
      <div className="px-5 pb-5 max-h-[620px] overflow-y-auto">
        {list.map((item, idx) => {
          return (
            <div
              key={idx}
              className="w-full flex justify-between items-center py-[14px] border-b border-solid border-secondaryBorder"
            >
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold">{item.action}</div>
                <div className="text-xs text-secondaryText">{formatDate(item.createdAt)}</div>
              </div>
              <div
                className={`text-base font-semibold ${
                  item.balance > 0 ? 'text-successText' : 'text-defaultText'
                }`}
              >
                {item.balance > 0 ? `+${item.balance}` : item.balance}
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="w-full p-16 text-center text-secondaryText">No Result</p>
        )}
      </div>
    </MantineModal>
  );
}
