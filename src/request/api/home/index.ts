import service, { IBaseRes } from '~/request/index';

export const getHomeFeatured = (): IBaseRes<any> => {
  return service({
    url: `/v1/home/featured`,
    method: 'get',
  });
};