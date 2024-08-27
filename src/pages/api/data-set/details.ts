import { NextApiRequest, NextApiResponse } from 'next';
import { getDatasetDetail } from '~/request/api/data-set';
import { ResultEdit } from '~/request/api/data-set/type';
import { IBaseRes } from '~/request';

type params = {
  id: string | number;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id }: params = JSON.parse(req.body);
  const response: IBaseRes<ResultEdit> = await getDatasetDetail({ id });
  // console.log('response', response);
  if (response.code === 200) {
    res.status(200).json(response);
  } else {
    res.status(response.code).json(response);
  }
};
