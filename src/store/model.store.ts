import { create } from 'zustand';
import { TAppealStatus } from '~/request/api/model/type';

interface TotalCounts {
  like: number;
  collect: number;
  download: number;
  generate: number;
  reward: number;
}

type TModelStore = {
  likeModelIds: number[];
  collectModelIds: number[];
  totalCounts: TotalCounts;
  refreshModelTotalCountKey: number;
  rewardCount: number;
  appealStatus: TAppealStatus;
  setLikeModelIds: (data: number[]) => void;
  setCollectModelIds: (data: number[]) => void;
  setTotalCounts: (data: Partial<TotalCounts>) => void;
  setRefreshModelTotalCountKey: () => void;
  setAppealStatus: (data: TAppealStatus) => void;
  setRewardCount: (data: number) => void;
};

export const useModelStore = create<TModelStore>((set) => ({
  likeModelIds: [],
  collectModelIds: [],
  totalCounts: {
    like: 0,
    collect: 0,
    download: 0,
    generate: 0,
    reward: 0,
  },
  rewardCount: 0,
  refreshModelTotalCountKey: 0,
  appealStatus: 'audit_pass',
  setLikeModelIds: (data) => set((state) => ({ likeModelIds: data })),
  setCollectModelIds: (data) => set((state) => ({ collectModelIds: data })),
  setTotalCounts: (data) =>
    set((state) => ({ totalCounts: Object.assign({}, state.totalCounts, data) })),
  setRefreshModelTotalCountKey: () =>
    set(() => ({ refreshModelTotalCountKey: new Date().getTime() })),
  setAppealStatus: (data) => set((state) => ({ appealStatus: data })),
  setRewardCount: (data) => set((state) => ({ rewardCount: data })),
}));
