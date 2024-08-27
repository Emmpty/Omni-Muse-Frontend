import { NextApiRequest, NextApiResponse } from 'next';

import { MixedAuthEndpoint, handleEndpointError } from '~/server/utils/endpoint-helpers';

import { TUserProps } from '~/store/user.store';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default MixedAuthEndpoint(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: TUserProps | undefined
) {
  try {
  } catch (e) {
    return handleEndpointError(res, e);
  }
});
