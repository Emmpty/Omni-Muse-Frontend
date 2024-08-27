import dynamic from 'next/dynamic';
import { ComponentProps, ComponentType } from 'react';
import { UrlObject } from 'url';

const HiddenCommentsModal = dynamic(() => import('~/components/CommentsV2/HiddenCommentsModal'));
const CommentEditModal = dynamic(
  () => import('~/components/Model/ModelDiscussion/CommentEditModal')
);
const CommentThreadModal = dynamic(
  () => import('~/components/Model/Discussion/CommentThreadModal')
);
const TopUpModal = dynamic(() => import('~/omnimuse-lib/features/recharge/TopUp'));
const PayModal = dynamic(() => import('~/omnimuse-lib/features/recharge/Pay'));
const TradeHistoryModal = dynamic(() => import('~/omnimuse-lib/features/recharge/TradeHistory'));
const CreditsDetailModal = dynamic(() => import('~/omnimuse-lib/features/recharge/CreditsDetail'));
const UserProfileEdit = dynamic(() => import('~/omnimuse-lib/features/user/UserProfileEdit'));
const AppealDialog = dynamic(() => import('~/components/Dialog/Common/AppealDialog'));
const PayConfirmModal = dynamic(() => import('~/omnimuse-lib/features/recharge/PayConfirm'));
const Reward = dynamic(() => import('~/omnimuse-lib/features/recharge/Reward/index'));

type Url = UrlObject | string;
type DialogItem<T> = {
  requireAuth?: boolean;
  component: ComponentType<T>;
  resolve: (
    query: Record<string, unknown>,
    args: ComponentProps<ComponentType<T>>
  ) => { query: Record<string, unknown>; asPath?: Url; state?: Record<string, unknown> };
};
type DialogRegistry<T extends Record<string, any>> = { [K in keyof T]: DialogItem<T[K]> };

function createDialogDictionary<T extends Record<string, unknown>>(
  dictionary: DialogRegistry<T>
): DialogRegistry<T> {
  return dictionary;
}

export const dialogs = createDialogDictionary({
  hiddenModelComments: {
    component: HiddenCommentsModal,
    resolve: (query, { modelId }) => ({
      query: { ...query, modelId },
    }),
  },
  commentEdit: {
    component: CommentEditModal,
    resolve: (query, { contentId, type, commentId }) => ({
      query: { ...query, contentId, type, commentId },
    }),
  },
  commentThread: {
    component: CommentThreadModal,
    resolve: (query, { commentId, contentId, type }) => ({
      query: { ...query, commentId, contentId, type },
    }),
  },
  topUp: {
    component: TopUpModal,
    resolve: (query) => ({
      query,
    }),
  },
  pay: {
    component: PayModal,
    resolve: (query, { isCustom, value, credits }) => ({
      query: { ...query, isCustom, value, credits },
    }),
  },
  reward: {
    component: Reward,
    resolve: (query, { amount, type, id }) => ({
      query: { ...query, amount, type, id },
    }),
  },
  tradeHistory: {
    component: TradeHistoryModal,
    resolve: (query) => ({
      query,
    }),
  },
  creditsDetail: {
    component: CreditsDetailModal,
    resolve: (query) => ({
      query,
    }),
  },
  buyModel: {
    component: PayConfirmModal,
    resolve: (query, { type, contentId, creditCount, ...state }) => ({
      query: { ...query, type, contentId, creditCount },
      state,
    }),
  },
  payConfirm: {
    component: PayConfirmModal,
    resolve: (query, { type, contentId, creditCount }) => ({
      query: { ...query, type, contentId, creditCount },
    }),
  },
  editUserProfileModal: {
    component: UserProfileEdit,
    resolve: (query) => ({
      query,
    }),
  },
  AppealModal: {
    component: AppealDialog,
    resolve: (query, { modelVersionId }) => ({
      query: { ...query, modelVersionId },
    }),
  },
});
