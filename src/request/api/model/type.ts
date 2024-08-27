export type TAppealStatus =
  | 'publish'
  | 'draft'
  | 'audit'
  | 'audit_fail'
  | 'audit_pass'
  | 'appeal'
  | 'appeal_fail';

export interface GetModelStartsAndCollectsRes {
  stars: number[];
  collects: number[];
}

export interface GetModelOperationCountsRes {
  totalcollectcount: number;
  totaldownloadcount: number;
  totalgeneratecount: number;
  totalstarcount: number;
  totalrewardcount: number;
}

export interface IModel {
  id: number;
  name: string;
  description: string;
  poi: boolean;
  nsfwLevel: number;
  nsfw: boolean;
  type: string;
  uploadType: string;
  updatedAt: string;
  deletedAt: null;
  deletedBy: number;
  status: string;
  checkpointType: string;
  allowNoCredit: boolean;
  allowCommercialUse: [];
  allowDerivatives: boolean;
  allowDifferentLicense: boolean;
  licenses: [];
  publishedAt: string;
  locked: boolean;
  meta: {
    imageNsfw: string;
  };
  earlyAccessDeadline: string;
  mode: string;
  availability: string;
  lockedProperties: [];
  reportStats: {
    ownershipProcessing: number;
  };
  user: {
    id: 1;
    image: string;
    username: string;
    deletedAt: string;
    rank: {
      leaderboardRank: null;
    };
    profilePicture: string;
    cosmetics: [];
  };
  modelVersions: IModelVersions[];
  metrics: null;
  tagsOnModels: [
    {
      tag: {
        id: number;
        name: string;
        isCategory: boolean;
      };
    }
  ];
  rank: {
    downloadCountAllTime: number;
    favoriteCountAllTime: number;
    thumbsUpCountAllTime: number;
    thumbsDownCountAllTime: number;
    commentCountAllTime: number;
    ratingCountAllTime: number;
    ratingAllTime: number;
    tippedAmountCountAllTime: number;
    imageCountAllTime: number;
    collectedCountAllTime: number;
    generationCountAllTime: number;
    rewardCountAllTime: number;
  };
  canGenerate: boolean;
  hasSuggestedResources: boolean;
}

export interface IModelVersions {
  walletAddr: string;
  hashCID: string;
  modelCID: string;
  allowSell: boolean;
  purchaseCredit: number;
  id: number;
  modelId: number;
  name: string;
  description: string;
  steps: number;
  epochs: number;
  clipSkip: number;
  createdAt: string;
  credit: number;
  updatedAt: string;
  trainedWords: [];
  trainingStatus: string;
  trainingDetails: null;
  inaccurate: boolean;
  baseModel: string;
  baseModelType: string;
  earlyAccessTimeFrame: number;
  status: string;
  auditType: string;
  publishedAt: string;
  meta: {
    imageNsfw: string;
  };
  vaeId: string;
  settings: null;
  requireAuth: boolean;
  nsfwLevel: number;
  metrics: null;
  files: [
    {
      id: number;
      url: string;
      sizeKB: number;
      name: string;
      type: string;
      visibility: string;
      metadata: {
        fp: string;
        size: string;
        format: string;
      };
      pickleScanResult: string;
      pickleScanMessage: string;
      virusScanResult: string;
      virusScanMessage: null;
      scannedAt: string;
      modelVersionId: number;
      hashes: null;
    },
    {
      id: number;
      url: string;
      sizeKB: number;
      name: string;
      type: string;
      visibility: string;
      metadata: {
        fp: string;
        size: string;
        format: string;
      };
      pickleScanResult: string;
      pickleScanMessage: string;
      virusScanResult: string;
      virusScanMessage: null;
      scannedAt: string;
      modelVersionId: number;
      hashes: null;
    }
  ];
  generationCoverage: {
    covered: boolean;
  };
  recommendedResources: null;
  rank: {
    downloadCountAllTime: number;
    favoriteCountAllTime: number;
    thumbsUpCountAllTime: number;
    thumbsDownCountAllTime: number;
    commentCountAllTime: number;
    ratingCountAllTime: number;
    ratingAllTime: number;
    tippedAmountCountAllTime: number;
    imageCountAllTime: number;
    collectedCountAllTime: number;
    generationCountAllTime: number;
  };
  posts?: [];
  hashes: null;
  earlyAccessDeadline: string;
  canDownload: boolean;
  canGenerate: boolean;
}
