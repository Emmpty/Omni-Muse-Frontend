import { InferGetServerSidePropsType } from 'next';
import { createServerSideProps } from '~/server/utils/server-side-helpers';

import { isNumber } from '~/utils/type-guards';
import ModelDetailsPage from '~/omnimuse-lib/modules/models/slug/index';

export const getServerSideProps = createServerSideProps({
  useSSG: true,
  useSession: true,
  resolver: async ({ ctx }) => {
    const params = (ctx.params ?? {}) as {
      id: string;
      slug: string[];
    };
    const id = Number(params.id);

    if (!isNumber(id)) return { notFound: true };

    return {
      props: { id },
    };
  },
});

const ModelDetailsV2 = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <ModelDetailsPage id={id} />;
};
export default ModelDetailsV2;
