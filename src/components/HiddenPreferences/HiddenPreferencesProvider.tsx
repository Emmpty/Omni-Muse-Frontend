import { useContext, createContext, ReactNode, useMemo, useDeferredValue } from 'react';
import { useQueryHiddenPreferences } from '~/hooks/hidden-preferences';
import { useCurrentUser } from '~/hooks/useCurrentUser';

export type HiddenPreferencesState = {
  hiddenUsers: Map<number, boolean>;
  hiddenTags: Map<number, boolean>;
  hiddenModels: Map<number, boolean>;
  hiddenImages: Map<number, boolean>;
  hiddenLoading: boolean;
  moderatedTags: any[];
};

const HiddenPreferencesContext = createContext<HiddenPreferencesState | null>(null);
export const useHiddenPreferencesContext = () => {
  const context = useContext(HiddenPreferencesContext);
  if (!context)
    throw new Error('useHiddenPreferences can only be used inside HiddenPreferencesProvider');
  return context;
};

export const HiddenPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQueryHiddenPreferences();
  const currentUser = useCurrentUser();
  const disableHidden = currentUser?.disableHidden;

  const hidden = useMemo(() => {
    const moderatedTags = data.hiddenTags.filter((x) => !!x.nsfwLevel);
    const tags = new Map(
      data.hiddenTags
        .filter((x) => !disableHidden && x.hidden && !moderatedTags.some((m) => m.id === x.id))
        .map((x) => [x.id, true])
    );

    const images = new Map(
      data.hiddenImages.filter((x) => !x.tagId || tags.get(x.tagId)).map((x) => [x.id, true])
    );

    return {
      hiddenUsers: new Map(data.hiddenUsers.map((x) => [x.id, true])),
      hiddenModels: new Map(data.hiddenModels.map((x) => [x.id, true])),
      hiddenTags: tags,
      hiddenImages: images,
      hiddenLoading: isLoading,
      moderatedTags,
    };
  }, [data, isLoading, disableHidden]);

  const hiddenDeferred = useDeferredValue(hidden);

  return (
    <HiddenPreferencesContext.Provider value={hiddenDeferred}>
      {children}
    </HiddenPreferencesContext.Provider>
  );
};
