import { Container } from '@mantine/core';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { BountyUpsertForm } from '~/components/Bounty/BountyUpsertForm';
import { useLoginAuthentication } from '~/hooks/useLoginAuthentication';
import { getBountiesDataDetail } from '~/request/api/bounty';
import { getResult } from '~/request/api/bounty/type';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const getServerSideProps = createServerSideProps({
  useSession: true,
  resolver: async ({}) => {
    return { props: {} };
  },
});

type files = {
  filename: string;
  fileSize: number;
  fileHash: string;
};

export default function BountyCreate() {
  const router = useRouter();

  const [key, setKey] = useState(0);

  const [defaultValue, setDefaultValue] = useState<getResult>({
    id: '',
    name: '',
    type: '',
    model: '',
    description: '',
    start: '',
    deadline: '',
    unit_amount: 500,
    maxEntriesPerHunter: 0,
    statusType: 0,
    imageHash: [],
    fileHash: [],
    image_id: [],
    files: [],
  });
  useEffect(() => {
    if (router?.query.id) {
      // @ts-ignore
      getDataDetail(router.query.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);
  const getDataDetail = async (id: string | number | undefined) => {
    const res = await getBountiesDataDetail({ id });
    const data = res.result;
    let reslutFiles = [];
    if (data.fileHash?.length > 0) {
      reslutFiles = data.fileHash.map((f: files) => {
        return {
          name: f.filename,
          size: f.fileSize,
          hash: f.fileHash,
          done: true,
          value: 100,
        };
      });
    }
    // 这里放了一些多余的字段是为兼容后端一些不同的接口返回不同的字段
    const dataValue: getResult = {
      id: data.ID,
      name: data.name,
      type: data.type,
      model: data.model,
      description: data.description,
      start: data.starts_at,
      deadline: data.expires_at,
      unit_amount: data.unitAmount,
      maxEntriesPerHunter: data.maxEntriesPerHunter,
      image_id: data.imageHash || [],
      files: reslutFiles,
      statusType: 0,
      fileHash: reslutFiles,
    };
    setDefaultValue(dataValue);
    setKey(key + 1);
  };

  const { initFlag } = useLoginAuthentication();
  if (!initFlag) {
    return <></>;
  }

  return (
    <Container size="md">
      <BountyUpsertForm key={key} defaultValue={defaultValue} />
    </Container>
  );
}
