import { MetricTimeframe } from '~/types/prisma/schema';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useZodRouteParams } from '~/hooks/useZodRouteParams';
import { ModelSort } from '~/server/common/enums';
import { showErrorNotification } from '~/utils/notifications';
import { removeEmpty } from '~/utils/object-helpers';
import { trpc } from '~/utils/trpc';
import { constants } from '~/server/common/constants';
import { isEqual } from 'lodash-es';
import { useFiltersContext } from '~/providers/FiltersProvider';

const modelQueryParamSchema = z
  .object({
    period: z.nativeEnum(MetricTimeframe),
    sort: z.nativeEnum(ModelSort),
    query: z.string(),
    user: z.string(),
    tagname: z.string(),
    tag: z.string(),
    favorites: z.coerce.boolean(),
    hidden: z.coerce.boolean(),
    archived: z.coerce.boolean(),
    followed: z.coerce.boolean(),
    view: z.enum(['categories', 'feed']),
    section: z.enum(['published', 'draft', 'training']),
    collectionId: z.coerce.number(),
    excludedTagIds: z.array(z.coerce.number()),
    excludedImageTagIds: z.array(z.coerce.number()),
    baseModels: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.enum(constants.baseModels))
    ),
    clubId: z.coerce.number().optional(),
  })
  .partial();
export type ModelQueryParams = z.output<typeof modelQueryParamSchema>;
export const useModelQueryParams = () => {
  const { query, pathname, replace } = useRouter();

  return useMemo(() => {
    const result = modelQueryParamSchema.safeParse(query);
    const data: ModelQueryParams = result.success ? result.data : {};

    return {
      ...data,
      set: (filters: Partial<ModelQueryParams>, pathnameOverride?: string) => {
        replace(
          {
            pathname: pathnameOverride ?? pathname,
            query: removeEmpty({ ...query, ...filters }),
          },
          undefined,
          {
            shallow: !pathnameOverride || pathname === pathnameOverride,
          }
        );
      },
    };
  }, [query, pathname, replace]);
};

export const useModelQueryParams2 = () => useZodRouteParams(modelQueryParamSchema);

export const useModelFilters = () => {
  const storeFilters = useFiltersContext((state) => state.models);
  return removeEmpty(storeFilters);
};

export const useDumbModelFilters = (defaultFilters?: Partial<Omit<any, 'page'>>) => {
  const [filters, setFilters] = useState<Partial<Omit<any, 'page'>>>(
    defaultFilters ?? {}
  );
  const filtersUpdated = !isEqual(filters, defaultFilters);

  return {
    filters,
    setFilters,
    filtersUpdated,
  };
};

export const useToggleCheckpointCoverageMutation = () => {
  const queryUtils = trpc.useUtils();

  const toggleMutation = trpc.model.toggleCheckpointCoverage.useMutation({
    onSuccess: (_, { id, versionId }) => {
      queryUtils.model.getById.setData({ id }, (old) => {
        if (!old) return old;

        return {
          ...old,
          modelVersions: old.modelVersions.map((v) =>
            v.id === versionId ? { ...v, canGenerate: !v.canGenerate } : v
          ),
        };
      });
    },
    onError: (error) => {
      showErrorNotification({
        title: 'Failed to toggle checkpoint coverage',
        error: new Error(error.message),
      });
    },
  });

  const handleToggle = (data: any) => {
    return toggleMutation.mutateAsync(data);
  };

  return { ...toggleMutation, toggle: handleToggle };
};
