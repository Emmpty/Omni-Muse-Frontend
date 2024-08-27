import { Meta } from '~/components/Meta/Meta';
import { Availability, ModelStatus } from '~/types/prisma/schema';
import { getDisplayName, removeTags, slugit } from '~/utils/string-helpers';
import { truncate } from 'lodash-es';
import { IModel } from '~/request/api/model/type';

interface ModelDetailMetaProps {
  versionName?: string;
  model: IModel;
}

const ModelDetailMeta = ({ model, versionName }: ModelDetailMetaProps) => {
  return (
    <Meta
      title={`${model.name}${
        versionName ? ' - ' + versionName : ''
      } | Stable Diffusion ${getDisplayName(model.type)} | Omnimuse`}
      description={truncate(removeTags(model.description ?? ''), { length: 150 })}
      links={[
        {
          href: `/models/${model.id}/${slugit(model.name)}`,
          rel: 'canonical',
        },
      ]}
      deIndex={
        model.status !== ModelStatus.Published || model.availability === Availability.Unsearchable
      }
    />
  );
};

export default ModelDetailMeta;
