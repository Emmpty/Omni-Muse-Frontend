export interface RootObject {
  id: string | number | undefined;
}

// 赏金过滤参数
interface Filter {
  TimePeriod: string;
  BountiesType: string[];
  BountiesStatus: string;
}
// 赏金列表请求参数
export interface bountyListParmas {
  keywords: string;
  filter: Filter;
  sort: string;
  page: number;
  limit: number;
}

export interface pageWorkParams {
  id: string | number;
  pageNum?: number;
  pageSize?: number;
}

export interface WorkFile {
  filename: string;
  fileHash: string;
}

export interface workAddParams {
  bountyId?: number | number;
  workFile?: WorkFile[];
  description: string;
  sampleImage: string;
}

export interface BountyBenefactor {
  bounty_id: number;
  user_id: number;
  awarded_to_id: number;
  unit_amount: number;
  currency: string;
}

export interface WorkFileList {
  filename: string;
  fileFormat: string;
  fileSize: number;
  fileHash: string;
}

export interface BountyWork {
  id: string;
  userId: number;
  bountyId: number;
  description: string;
  sampleImage: string;
  acceptTime?: any;
  status: number;
  createdAt: string;
  cover: string;
  imageList: string[];
  workFileList: WorkFileList[];
  credit: string;
  userInfo: any;
}

export interface workDetailResult {
  length: number;
  bountyBenefactor: BountyBenefactor;
  bountyWork: BountyWork;
}

export interface getResult {
  id: number | string;
  name: string;
  type: string;
  model: string;
  description: string;
  start: string;
  deadline: string;
  unit_amount: number;
  maxEntriesPerHunter: number;
  statusType: number | string;
  imageHash?: string[];
  fileHash: File_id[];
  image_id?: string[];
  files: any;
}
export interface submitData {
  bountyId?: number | string;
  name: string;
  type: string;
  model: string;
  description: string;
  start: string;
  deadline: string;
  unit_amount?: number;
  maxEntiesPerHunter: number;
  statusType: number | string;
  bountyAmount: number | string;
  imageHash: string[];
  fileHash: File_id[];
}

export interface File_id {
  filename: string;
  fileSize: number;
  fileHash: string;
}

export interface Result {
  id: number;
  user_id: number;
  image: string;
  name: string;
  expires_at: string;
  starts_at: string;
  username: string;
  description: string;
  type: string;
  mode: string;
  unit_amount: number;
  favorite_count_all_time: number;
  track_count_all_time: number;
  entry_count_all_time: number;
  benefactor_count_all_time: number;
  unit_amount_count_all_time: number;
  comment_count_all_time: number;
  image_id: string[];
  file_id: File_id[];
  created_at: string;
  isLike: boolean;
  isStar: boolean;
}

export interface Item {
  id: number;
  user_id: number;
  avatar: string;
  name: string;
  username: string;
  type: string;
  mode: string;
  unit_amount: number;
  favorite_count_all_time: number;
  track_count_all_time: number;
  entry_count_all_time: number;
  benefactor_count_all_time: number;
  unit_amount_count_all_time: number;
  comment_count_all_time: number;
  image_id: string;
  created_at: string;
  expiresAt: string;
  startsAt: string;
}

export interface ResultList {
  items: Item[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  totalCount: number;
}

export interface listParams {
  sort: string;
  keywords: string | string[];
  page: number;
  limit: number;
}
