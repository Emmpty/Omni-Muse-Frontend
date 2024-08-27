import type { GetServerSidePropsContext } from 'next';

export const getServerAuthSession = async ({
  req,
  res,
}: {
  req: GetServerSidePropsContext['req'] & { context?: Record<string, unknown> };
  res: GetServerSidePropsContext['res'];
}) => {
  return null;
};
