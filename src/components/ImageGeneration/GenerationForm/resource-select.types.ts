import { BaseModel, BaseModelSetType, ResourceFilter } from '~/server/common/constants';
import { ModelType } from '~/types/prisma/schema';

export type ResourceSelectOptions = {
  canGenerate?: boolean;
  resources?: ResourceFilter[];
};
