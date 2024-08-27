import { ModelWizard } from '~/components/Resource/Wizard/ModelWizard';
import { useLoginAuthentication } from '~/hooks/useLoginAuthentication';
import { createServerSideProps } from '~/server/utils/server-side-helpers';

export const getServerSideProps = createServerSideProps({
  useSession: true,
  useSSG: true,
  resolver: async ({ ssg }) => {
    if (ssg) {
      await ssg.model.getMyDraftModels.prefetchInfinite({});
    }

    return { props: {} };
  },
});

export default function ModelNew() {
  const { initFlag } = useLoginAuthentication();
  if (!initFlag) {
    return <></>;
  }
  return <ModelWizard />;
}
