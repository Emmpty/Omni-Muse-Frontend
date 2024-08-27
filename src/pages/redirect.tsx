import { NotFound } from '~/components/AppLayout/NotFound';
import { createServerSideProps } from '~/server/utils/server-side-helpers';

export const getServerSideProps = createServerSideProps({
  useSSG: false,
  resolver: async ({ ctx }) => {
    const destination = '/404';

    return {
      redirect: {
        permanent: false,
        destination,
      },
    };
  },
});

export default function Redirect() {
  return <NotFound />;
}
