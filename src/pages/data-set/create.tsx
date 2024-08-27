import { Container } from '@mantine/core';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { DataSetUpsertForm } from '~/components/DataSet/DataSetUpsertForm';
import { getDatasetDataDetail } from '~/request/api/data-set';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLoginAuthentication } from '~/hooks/useLoginAuthentication';
import { ResultDataSet, AttachmentItem } from '~/request/api/data-set/type';
export const getServerSideProps = createServerSideProps({
  useSession: false,
  resolver: async ({}) => {
    return { props: {} };
  },
});
// 使用 React.memo 包裹 DataSetUpsertForm 组件
const MemoizedDataSetUpsertForm = React.memo(DataSetUpsertForm);

export default function BountyCreate() {
  const router = useRouter();

  const [key, setKey] = useState<number>(0);

  const [defaultValue, setDefaultValue] = useState<ResultDataSet>({
    name: '',
    note: '',
    statusType: 0,
    files: [],
  });

  useEffect(() => {
    if (router?.query.id) {
      getDataDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  const getDataDetail = async () => {
    const res = await getDatasetDataDetail({ id: router.query.id });
    const data = res.result;

    if (data.attachment && data.attachment.length > 0) {
      const attachment = data.attachment ? data.attachment : [];
      const fileData: any = attachment.map((f: AttachmentItem) => {
        return {
          name: f.filename,
          size: f.fileSize,
          hash: f.fileHash,
          done: true,
          value: 100,
        };
      });

      const dataValue: ResultDataSet = {
        name: data.name,
        note: data.note,
        id: data.id,
        statusType: data.statusType,
        files: fileData,
      };
      setDefaultValue(dataValue);
      setKey(key + 1);
    } else {
      const dataValue: ResultDataSet = {
        name: data.name,
        note: data.note,
        id: data.id,
        statusType: data.statusType,
        files: [],
      };
      setDefaultValue(dataValue);
      setKey(key + 1);
    }
  };

  const { initFlag } = useLoginAuthentication();
  if (!initFlag) {
    return <></>;
  }

  return (
    <Container size="md">
      <MemoizedDataSetUpsertForm key={key} defaultValue={defaultValue} />
    </Container>
  );
}
