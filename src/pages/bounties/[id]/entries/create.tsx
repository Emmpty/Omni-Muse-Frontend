import { Container } from '@mantine/core';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { BountyUpsertFormCreate } from '~/components/Bounty/BountyUpsertFormCreate';
import { z } from 'zod';
import { InferGetServerSidePropsType } from 'next';
import { removeEmpty } from '~/utils/object-helpers';
import { useLoginAuthentication } from '~/hooks/useLoginAuthentication';

const querySchema = z.object({
  id: z.coerce.number(),
});
export const getServerSideProps = createServerSideProps({
  useSSG: true,
  useSession: true,
  resolver: async ({ ctx, ssg, features }) => {
    if (!features?.bounties) return { notFound: true };

    const result = querySchema.safeParse(ctx.query);
    if (!result.success) return { notFound: true };

    if (ssg) await ssg.bounty.getById.prefetch({ id: result.data.id });

    return { props: removeEmpty(result.data) };
  },
});

export default function BountyEntryCreate({
  id
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { initFlag } = useLoginAuthentication();
  if (!initFlag) {
    return <></>;
  }
  return (
    <Container size="md" py="xl" className="pb-0">
      <BountyUpsertFormCreate />
    </Container>
  );
}
