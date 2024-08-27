import { GetServerSidePropsContext, GetServerSidePropsResult, Redirect } from 'next';
import { FeatureAccess, getFeatureFlags } from '~/types/flags';
import { getServerAuthSession } from '~/server/utils/get-server-auth-session';
import {
  browsingLevelOr,
  publicBrowsingLevelsFlag,
} from '~/shared/constants/browsingLevel.constants';
import { parseCookies } from '~/shared/utils';

export function parseBrowsingMode(
  cookies: Partial<{ [key: string]: string }>,
  session: any | null
) {
  if (!session?.user) {
    return {
      browsingLevel: publicBrowsingLevelsFlag,
      showNsfw: false,
    };
  }

  const { browsingLevel, showNsfw } = parseCookies(cookies);
  return {
    showNsfw: showNsfw ?? session.user.showNsfw ?? false,
    browsingLevel: browsingLevelOr([browsingLevel, session.user.browsingLevel]),
  };
}

export function createServerSideProps<P>({
  resolver,
  useSSG,
  useSession = false,
  prefetch = 'once',
}: CreateServerSidePropsProps<P>) {
  return async (context: GetServerSidePropsContext) => {
    const isClient = context.req.url?.startsWith('/_next/data') ?? false;
    const session =
      (context.req as any)['session'] ?? (useSession ? await getServerAuthSession(context) : null);
    const flags = (context.req as any)['flags'] ?? getFeatureFlags({ user: session?.user });
    const { browsingLevel } = parseBrowsingMode(context.req.cookies, session);

    const ssg = undefined;

    const result = (await resolver({
      ctx: context,
      isClient,
      ssg,
      session,
      features: flags,
      browsingLevel,
    })) as GetPropsFnResult<P> | undefined;

    let props: GetPropsFnResult<P>['props'] | undefined;
    if (result) {
      if (result.redirect) return { redirect: result.redirect };
      if (result.notFound) return { notFound: result.notFound };

      props = result.props;
    }

    return {
      props: {
        session,
        flags,
        ...(props ?? {}),
      },
    };
  };
}

type GetPropsFnResult<P> = {
  props: P | Promise<P>;
  redirect: Redirect;
  notFound: true;
};

type CreateServerSidePropsProps<P> = {
  useSSG?: boolean;
  useSession?: boolean;
  prefetch?: 'always' | 'once';
  resolver: (
    context: CustomGetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P> | void>;
};

type CustomGetServerSidePropsContext = {
  ctx: GetServerSidePropsContext;
  isClient: boolean;
  ssg?: any;
  session?: any | null;
  features?: FeatureAccess;
  browsingLevel: number;
};
