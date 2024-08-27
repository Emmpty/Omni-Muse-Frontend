import { create } from 'zustand';

type TCommonStore = {
  refreshCommentKey: number;
  refreshOtherUserInfoKey: number;
  setRefreshCommentKey: () => void;
  setRefreshOtherUserInfoKey: () => void;
};

export const useCommonStore = create<TCommonStore>((set) => ({
  refreshCommentKey: 0,
  refreshOtherUserInfoKey: 0,
  setRefreshCommentKey: () => set(() => ({ refreshCommentKey: new Date().getTime() })),
  setRefreshOtherUserInfoKey: () => set(() => ({ refreshOtherUserInfoKey: new Date().getTime() })),
}));
