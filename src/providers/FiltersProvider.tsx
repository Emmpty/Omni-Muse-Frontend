import {
  CheckpointType,
  ImageGenerationProcess,
  MediaType,
  MetricTimeframe,
  ModelStatus,
  ModelType,
} from '~/types/prisma/schema';
import { createContext, useCallback, useContext, useRef } from 'react';
import { z } from 'zod';
import { createStore, useStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { constants } from '~/server/common/constants';
import { BountySort, BountyStatus, ImageSort, ModelSort } from '~/server/common/enums';
import { removeEmpty } from '~/utils/object-helpers';

export type ModelFilterSchema = z.infer<typeof modelFilterSchema>;
const modelFilterSchema = z.object({
  period: z.nativeEnum(MetricTimeframe).default(MetricTimeframe.Month),
  sort: z.nativeEnum(ModelSort).default(ModelSort.HighestRated),
  types: z.nativeEnum(ModelType).array().optional(),
  checkpointType: z.nativeEnum(CheckpointType).optional(),
  baseModels: z.enum(constants.baseModels).array().optional(),
  status: z.nativeEnum(ModelStatus).array().optional(),
  earlyAccess: z.boolean().optional(),
  supportsGeneration: z.boolean().optional(),
  fromPlatform: z.boolean().optional(),
  followed: z.boolean().optional(),
  archived: z.boolean().optional(),
  hidden: z.boolean().optional(),
  fileFormats: z.enum(constants.modelFileFormats).array().optional(),
  pending: z.boolean().optional(),
});

type ImageFilterSchema = z.infer<typeof imageFilterSchema>;
const imageFilterSchema = z.object({
  period: z.nativeEnum(MetricTimeframe).default(MetricTimeframe.Week),
  sort: z.nativeEnum(ImageSort).default(ImageSort.MostReactions),
  generation: z.nativeEnum(ImageGenerationProcess).array().optional(),
  excludeCrossPosts: z.boolean().optional(),
  types: z.array(z.nativeEnum(MediaType)).default([MediaType.image]),
  withMeta: z.boolean().optional(),
  fromPlatform: z.boolean().optional(),
  hidden: z.boolean().optional(),
  followed: z.boolean().optional(),
});

const modelImageFilterSchema = imageFilterSchema.extend({
  sort: z.nativeEnum(ImageSort).default(ImageSort.Newest), // Default sort for model images should be newest
  period: z.nativeEnum(MetricTimeframe).default(MetricTimeframe.AllTime), //Default period for model details should be all time
  types: z.array(z.nativeEnum(MediaType)).default([]),
});

type BountyFilterSchema = z.infer<typeof bountyFilterSchema>;
const bountyFilterSchema = z.object({
  period: z.nativeEnum(MetricTimeframe).default(MetricTimeframe.AllTime),
  sort: z.nativeEnum(BountySort).default(BountySort.HighestBounty),
  status: z.nativeEnum(BountyStatus).default(BountyStatus.Open),
});

type StorageState = {
  models: ModelFilterSchema;
  images: ImageFilterSchema;
  modelImages: ImageFilterSchema;
  bounties: BountyFilterSchema;
};
export type FilterSubTypes = keyof StorageState;

const periodModeTypes = ['models', 'images', 'posts', 'articles', 'bounties'] as const;
export type PeriodModeType = (typeof periodModeTypes)[number];
export const hasPeriodMode = (type: string) => periodModeTypes.includes(type as PeriodModeType);

type FilterState = StorageState;
export type FilterKeys<K extends keyof FilterState> = keyof Pick<FilterState, K>;

type StoreState = FilterState & {
  setModelFilters: (filters: Partial<ModelFilterSchema>) => void;
  setImageFilters: (filters: Partial<ImageFilterSchema>) => void;
  setModelImageFilters: (filters: Partial<ImageFilterSchema>) => void;
  setBountyFilters: (filters: Partial<BountyFilterSchema>) => void;
};

type LocalStorageSchema = Record<keyof StorageState, { key: string; schema: z.AnyZodObject }>;
const localStorageSchemas: LocalStorageSchema = {
  models: { key: 'model-filters', schema: modelFilterSchema },
  images: { key: 'image-filters', schema: imageFilterSchema },
  modelImages: { key: 'model-image-filters', schema: modelImageFilterSchema },
  bounties: { key: 'bounties-filters', schema: bountyFilterSchema },
};

const getInitialValues = <TSchema extends z.AnyZodObject>({
  key,
  schema,
}: {
  key: string;
  schema: TSchema;
}) => {
  if (typeof window === 'undefined') return schema.parse({});
  const storageValue = localStorage.getItem(key) ?? '{}';
  const value = deserializeJSON(storageValue);
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  else {
    // if the data failed to parse, get new defaults and update localstorage
    const defaults = schema.parse({});
    localStorage.setItem(key, serializeJSON(defaults));
    return defaults;
  }
};

const getInitialLocalStorageValues = () =>
  Object.entries(localStorageSchemas).reduce<Record<string, unknown>>(
    (acc, [key, value]) => ({
      ...acc,
      [key]: getInitialValues({ key: value.key, schema: value.schema }),
    }),
    {}
  ) as StorageState;

function handleLocalStorageChange<TKey extends keyof StorageState>({
  key,
  data,
  state,
}: {
  key: TKey;
  data: Record<string, unknown>;
  state: StoreState;
}) {
  const values = removeEmpty({ ...state[key], ...data });
  localStorage.setItem(localStorageSchemas[key].key, serializeJSON(values));
  return { [key]: values } as StoreState | Partial<StoreState>;
}

type FilterStore = ReturnType<typeof createFilterStore>;
const createFilterStore = () =>
  createStore<StoreState>()(
    devtools((set) => ({
      ...getInitialLocalStorageValues(),
      setModelFilters: (data) =>
        set((state) => handleLocalStorageChange({ key: 'models', data, state })),
      setImageFilters: (data) =>
        set((state) => handleLocalStorageChange({ key: 'images', data, state })),
      setModelImageFilters: (data) =>
        set((state) => handleLocalStorageChange({ key: 'modelImages', data, state })),
      setBountyFilters: (data) =>
        set((state) => handleLocalStorageChange({ key: 'bounties', data, state })),
    }))
  );

const FiltersContext = createContext<FilterStore | null>(null);
export function useFiltersContext<T>(selector: (state: StoreState) => T) {
  const store = useContext(FiltersContext);
  if (!store) throw new Error('Missing FiltersContext.Provider in the tree');
  return useStore(store, selector);
}

export const FiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<FilterStore>();
  if (!storeRef.current) storeRef.current = createFilterStore();

  return <FiltersContext.Provider value={storeRef.current}>{children}</FiltersContext.Provider>;
};

function serializeJSON<T>(value: T) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new Error(`Failed to serialize the value`);
  }
}

function deserializeJSON(value: string) {
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return value;
  }
}

export function useSetFilters(type: FilterSubTypes) {
  return useFiltersContext(
    useCallback(
      (state) =>
        ({
          models: state.setModelFilters,
          images: state.setImageFilters,
          modelImages: state.setModelImageFilters,
          bounties: state.setBountyFilters,
        }[type]),
      [type]
    )
  );
}
