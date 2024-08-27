// 1: 模型; 2: 图片; 3: 赏金; 4: 数据集
export type TOperation = 1 | 2 | 3 | 4;

// model=模型 (需传version_id), image=图片 (需传task_id), dataset=数据集
export type TDownload = 'model' | 'image' | 'dataset';

export type TLoginType = 'okx' | 'metamask';

export type TIsSystem = 0 | 1;

export interface OperationModelReq {
  contentId: number;
  type: TOperation;
  operation?: boolean;
}

export interface GetDownloadUrlReq {
  id: number | string;
  type: TDownload;
}

export interface OtherUserInfo {
  id: number;
  createdAt: string;
  image: string;
  username: string;
  fansCount: number;
  followerCount: number;
  likes: number;
  models: number;
  downloads: number;
  isFollow: boolean;
  isSystem: TIsSystem;
}

export interface SelfUserInfo extends OtherUserInfo {
  address: string;
  credit: number;
  loginType: TLoginType;
}

export interface operationParams {
  isDone: number;
  userId: number;
}

export interface bountiesUserResult {
  id: number;
  name: string;
  type: string;
  mode: string;
  unitAmount: number;
  username: string;
}
export interface dataSetsUserResult {
  id: number;
  name: string;
  viewCount: number;
  likeCount: number;
  starCount: number;
  username: string;
}

export interface rewardParams {
  id: string | number;
  type: string | number;
  amount: number | number;
}
export interface behavior {
  count: number;
}

export interface dataSetItem {
  id: number;
  time: string;
  avatar: string;
  user: string;
  name: string;
  download: number;
  collect: number;
  comment: number;
  reward?: number;
  userId?: string | number;
  rewardCount?: number;
  like: number;
}

export interface bountyItem {
  id: number | string;
  userId?: number | string;
  name: string;
  time: string;
  type: string;
  avatar: string;
  image: string;
  bounty: number;
  user: string;
  download: number;
  collect: number;
  comment: number;
  expiresAt: string;
  startsAt: string;
  statusType: number;
  participants: number;
}
