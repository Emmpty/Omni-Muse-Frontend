import { trpc } from '~/utils/trpc';

export const useTrackEvent = () => {
  const { mutateAsync: trackShare } = trpc.track.trackShare.useMutation();
  const { mutateAsync: trackAction } = trpc.track.addAction.useMutation();
  const { mutateAsync: trackSearch } = trpc.track.trackSearch.useMutation();

  const handleTrackShare = (data: any) => {
    return trackShare(data);
  };

  const handleTrackAction = (data: any) => {
    return trackAction(data);
  };

  const handleTrackSearch = (data: any) => {
    return trackSearch(data);
  };

  return {
    trackShare: handleTrackShare,
    trackAction: handleTrackAction,
    trackSearch: handleTrackSearch,
  };
};
