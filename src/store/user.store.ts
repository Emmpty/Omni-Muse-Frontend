import { create } from 'zustand';
import { TLoginType, TIsSystem } from '~/request/api/user/type';
import { FeatureAccess } from '~/types/flags';

export type TUserProps = {
  token: string;
  address: string;
  id: number;
  username: string;
  credit: number;
  image?: string;
  createdAt?: string;
  permissions?: string[];
  fansCount: number;
  followerCount: number;
  likes: number;
  models: number;
  downloads: number;
  isFollow: boolean;
  loginType: TLoginType;
  isSystem: TIsSystem;
  // 暂时没用上
  blurNsfw: boolean;
  showNsfw: boolean;
  browsingLevel: number;
  disableHidden?: boolean;
  isMember: boolean;
  onboarding: number;
  email?: string;
  emailVerified?: string;
  isModerator?: boolean;
  customerId?: string;
  subscriptionId?: string;
  tier?: 'free' | 'founder';
  muted?: boolean;
  bannedAt?: string;
  autoplayGifs?: boolean;
  filePreferences?: UserFilePreferences;
  leaderboardShowcase?: string;
  referral?: {
    id: number;
  };
  name?: string | null;
};

export const defaultFlags: FeatureAccess = {
  earlyAccessModel: false,
  apiKeys: false,
  ambientCard: false,
  gallery: false,
  posts: false,
  articles: false,
  articleCreate: false,
  adminTags: false,
  civitaiLink: false,
  stripe: false,
  imageTraining: false,
  imageTrainingResults: false,
  sdxlGeneration: false,
  questions: false,
  imageGeneration: false,
  enhancedSearch: false,
  alternateHome: false,
  collections: false,
  air: false,
  modelCardV2: false,
  profileCollections: false,
  imageSearch: false,
  buzz: false,
  signal: false,
  assistant: false,
  bounties: false,
  newsroom: false,
  safety: false,
  profileOverhaul: false,
  csamReports: false,
  clubs: false,
  createClubs: false,
  moderateTags: false,
  chat: false,
  creatorsProgram: false,
  buzzWithdrawalTransfer: false,
  vault: false,
};

export const loginUserInfo: TUserProps = {
  token: '',
  address: '',
  id: 0,
  username: '',
  credit: 0,
  image: '',
  createdAt: '',
  permissions: ['admin'],
  fansCount: 0,
  followerCount: 0,
  likes: 0,
  models: 0,
  downloads: 0,
  isFollow: false,
  loginType: 'metamask',
  isSystem: 0,
  // 暂时没用上
  blurNsfw: false,
  showNsfw: false,
  browsingLevel: 1,
  disableHidden: false,
  isMember: true,
  onboarding: 15,
  email: 'omnimuse@gmail.com',
  isModerator: false,
  customerId: 'cus_PqsdfLfKgEjSqb5',
  tier: 'free', // 'founder' | 'free'
  muted: false,
  name: 'omnimuse',
  autoplayGifs: true,
};

export const loginFlags: FeatureAccess = {
  earlyAccessModel: true,
  apiKeys: true,
  ambientCard: true,
  gallery: true,
  posts: false,
  articles: true,
  articleCreate: true,
  adminTags: false,
  civitaiLink: false,
  stripe: false,
  imageTraining: true,
  imageTrainingResults: true,
  sdxlGeneration: true,
  questions: false,
  imageGeneration: true,
  enhancedSearch: true,
  alternateHome: true,
  collections: true,
  air: true,
  modelCardV2: true,
  profileCollections: true,
  imageSearch: true,
  buzz: true,
  signal: true,
  assistant: true,
  bounties: true,
  newsroom: true,
  safety: true,
  profileOverhaul: true,
  csamReports: false,
  clubs: false,
  createClubs: false,
  moderateTags: false,
  chat: true,
  creatorsProgram: false,
  buzzWithdrawalTransfer: false,
  vault: true,
};

type TUserStore = {
  userInfo: TUserProps | null;
  flags: FeatureAccess;
  setUserInfo: (data: Partial<TUserProps>) => void;
  clearUserInfo: () => void;
  setFlags: (data: Partial<FeatureAccess>) => void;
};

export const useUserStore = create<TUserStore>((set) => ({
  userInfo: null,
  flags: defaultFlags,
  setUserInfo: (data) => set((state) => ({ userInfo: Object.assign({}, state.userInfo, data) })),
  clearUserInfo: () => set(() => ({ userInfo: null })),
  setFlags: (data) => set((state) => ({ flags: Object.assign({}, state.flags, data) })),
}));
