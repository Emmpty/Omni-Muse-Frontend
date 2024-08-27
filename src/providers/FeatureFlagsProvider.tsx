import { useLocalStorage } from '@mantine/hooks';
import { createContext, useContext, useMemo, useState } from 'react';
import type { FeatureAccess } from '~/types/flags';
import { toggleableFeatures } from '~/types/flags';

const FeatureFlagsCtx = createContext<FeatureAccess>({} as FeatureAccess);

export const useFeatureFlags = () => {
  const features = useContext(FeatureFlagsCtx);
  const [toggled, setToggled] = useLocalStorage<Partial<FeatureAccess>>({
    key: 'toggled-features',
    defaultValue: toggleableFeatures.reduce(
      (acc, feature) => ({ ...acc, [feature.key]: feature.default }),
      {} as Partial<FeatureAccess>
    ),
  });

  const handleToggle = (key: keyof FeatureAccess, value: boolean) => {
    setToggled((prev) => ({ ...prev, [key]: value }));
  };

  const featuresWithToggled = useMemo(() => {
    return Object.keys(features).reduce((acc, key) => {
      const featureAccessKey = key as keyof FeatureAccess;
      const hasFeature = features[featureAccessKey];
      const toggleableFeature = toggleableFeatures.find(
        (toggleableFeature) => toggleableFeature.key === key
      );

      // Non toggleable features will rely on our standard feature flag settings:
      if (!toggleableFeature) {
        return {
          ...acc,
          [key]: hasFeature,
        };
      }

      return { ...acc, [key]: hasFeature } as FeatureAccess;
    }, {} as FeatureAccess);
  }, [features]);

  if (!features) throw new Error('useFeatureFlags can only be used inside FeatureFlagsCtx');

  return {
    ...featuresWithToggled,
    toggles: {
      available: toggleableFeatures,
      values: { ...toggled },
      set: handleToggle,
    },
  };
};
export const FeatureFlagsProvider = ({
  children,
  flags: initialFlags,
}: {
  children: React.ReactNode;
  flags: FeatureAccess;
}) => {
  const [flags] = useState(initialFlags);
  return <FeatureFlagsCtx.Provider value={flags}>{children}</FeatureFlagsCtx.Provider>;
};
