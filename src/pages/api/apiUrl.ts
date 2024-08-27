// @ts-ignore
let domain: string;
const HOST: string = process.env.HOST || 'localhost';
const PORT: number = process.env.PORT || 3000;

if (typeof window === 'undefined') {
  // console.log('在服务器上运行')
  // @ts-ignore
  domain = process.env.NODE_ENV == 'development' ? process.env.NEXT_PUBLIC_BASE_URL : HOST + PORT;
} else {
  // console.log('在客户端上运行')
  domain = window.location.origin;
}
console.log('domain', domain, process.env.NODE_ENV, HOST, PORT);
export const getDataSetDetails = domain + '/api/data-set/details';

export const getBountiesDetails = domain + '/api/bounties/details';
