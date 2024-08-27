import { NextApiRequest, NextApiResponse } from 'next';

import { AuthedEndpoint } from '~/server/utils/endpoint-helpers';
import { TUserProps } from '~/store/user.store';

export default AuthedEndpoint(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: TUserProps
) {
  res.send({
    id: user.id,
    username: user.username,
    tier: user.tier,
    status: user.bannedAt ? 'banned' : user.muted ? 'muted' : 'active',
  });
});
