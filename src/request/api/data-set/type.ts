export interface AttachmentItem {
  filename: string;
  fileFormat: string;
  fileSize: number;
  fileHash: string;
}

export interface ResultEdit {
  id: number;
  userId: number;
  name: string;
  note: string;
  attachment: AttachmentItem[];
  username: string;
  downloadCount: number;
  rewardCount: number;
  viewCount: number;
  likeCount: number;
  starCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  isLike: boolean;
  isStar: boolean;
  statusType?: number | string;
}

export interface SubmitDataSetParams {
  name: string;
  note: string;
  attachment: AttachmentItem[];
  statusType?: number | string;
}

export interface typeFiles {
  name: string;
  size: any;
  hash: string;
  done: boolean;
  value: number;
}
export interface ResultDataSet {
  name: string;
  note: string;
  id?: number | string;
  files: typeFiles[] | any;
  statusType?: number | string;
}

export interface listParams {
  sort: string;
  keywords: string | string[];
  page: number;
  limit: number;
}
