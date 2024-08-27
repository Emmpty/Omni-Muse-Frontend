import { ContextModalProps, openContextModal } from '@mantine/modals';
import { Generation } from '~/server/services/generation/generation.types';
import React from 'react';
import { BaseModel, baseModelSets } from '~/server/common/constants';
import { ResourceSelectOptions } from './resource-select.types';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';
import { getBaseModelSet } from '~/components/ImageGeneration/GenerationForm/generation.utils';
import { ModelType } from '~/types/prisma/schema';

type ResourceSelectModalProps = {
  title?: React.ReactNode;
  onSelect: (value: Generation.Resource) => void;
  options?: ResourceSelectOptions;
};

export const openResourceSelectModal = ({ title, ...innerProps }: ResourceSelectModalProps) =>
  openContextModal({
    modal: 'resourceSelectModal',
    title,
    zIndex: 400,
    innerProps,
    size: 1200,
  });

const ResourceSelectContext = React.createContext<{
  canGenerate?: boolean;
  resources: { type: ModelType; baseModels: BaseModel[] }[];
  onSelect: (value: Generation.Resource & { image: any }) => void;
} | null>(null);

export default function ResourceSelectModal({
  context,
  id,
  innerProps: { onSelect, options = {} },
}: ContextModalProps<ResourceSelectModalProps>) {
  const features = useFeatureFlags();

  const { resources = [], canGenerate } = options;
  const _resources = resources?.map(({ type, baseModelSet, baseModels }) => {
    let aggregate: BaseModel[] = [];
    if (baseModelSet) aggregate = getBaseModelSet(baseModelSet) ?? [];
    if (baseModels) aggregate = [...new Set([...aggregate, ...baseModels])];
    return { type, baseModels: aggregate };
  });

  const filters: string[] = [];
  if (canGenerate !== undefined) filters.push(`canGenerate = ${canGenerate}`);
  if (!!_resources.length) {
    const innerFilter: string[] = [];
    for (const { type, baseModels } of _resources) {
      if (!baseModels.length) innerFilter.push(`type = ${type}`);
      else
        innerFilter.push(
          `(${baseModels
            .map((baseModel) => `(type = ${type} AND version.baseModel = '${baseModel}')`)
            .join(' OR ')})`
          //TODO - use IN instead of OR
        );
    }
    filters.push(`(${innerFilter.join(' OR ')})`);
  }

  const exclude: string[] = [];
  exclude.push('NOT tags.name = "celebrity"');
  if (!features.sdxlGeneration) {
    for (const baseModel in baseModelSets.SDXL) {
      exclude.push(`NOT version.baseModel = ${baseModel}`);
    }
  }

  const handleSelect = (value: Generation.Resource) => {
    onSelect(value);
    context.closeModal(id);
  };

  return (
    <ResourceSelectContext.Provider
      value={{ onSelect: handleSelect, canGenerate, resources: _resources }}
    >
      select list
    </ResourceSelectContext.Provider>
  );
}
