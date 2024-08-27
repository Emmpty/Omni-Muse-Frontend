import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import { useDialogContext } from '~/components/Dialog/DialogProvider';
import style from './xtable.module.css';
import { ICreditRecord } from '~/request/api/credit/type';
import { getCreditRecords } from '~/request/api/credit';
import { formatDate } from '~/utils/date-helpers';

export default function TradeHistoryModal() {
  const dialog = useDialogContext();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<ICreditRecord[]>([]);
  const getList = async () => {
    setLoading(true);
    const res = await getCreditRecords([0]).finally(() => {
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
      title="TradeHistory"
      closeOnClickOutside={false}
      closeOnEscape={false}
      width={757}
    >
      <div className="p-5 max-h-[620px] overflow-y-auto">
        <div className="border border-solid border-secondaryBorder rounded-xl bg-secondaryBg">
          <table className={style.xtable}>
            <thead>
              <tr>
                <th>USD</th>
                <th>EMC</th>
                <th>Credits</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{item.usd}</td>
                    <td>{item.emc}</td>
                    <td>{item.balance}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {list.length === 0 && (
            <p className="w-full p-16 text-center text-secondaryText">No Result</p>
          )}
        </div>
      </div>
    </MantineModal>
  );
}
