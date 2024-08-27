import React, { useState } from 'react';
import {
  IconMenu2,
  IconChevronUp,
  IconChevronDown,
  IconDownload,
  IconBrush,
} from '@tabler/icons-react';
import { getDisplayName } from '~/utils/string-helpers';
import { formatDate } from '~/utils/date-helpers';
import { MantineColor } from '@mantine/core';
import { IModel, IModelVersions } from '~/request/api/model/type';
import copy from '~/utils/omnimuse/copy';

interface DetailCardProps {
  model: IModel;
  version: IModelVersions;
}

type RatingLabel = { label: string; color: MantineColor };
function getRatingLabel({
  positiveRating,
  totalCount,
}: {
  positiveRating: number;
  totalCount: number;
}): RatingLabel {
  if (positiveRating < 0.2) {
    if (totalCount < 10) return { label: 'Mixed', color: 'yellow' };
    else if (totalCount < 50) return { label: 'Negative', color: 'red' };
    else if (totalCount < 500) return { label: 'Very Negative', color: 'red' };
    else return { label: 'Overwhelmingly negative', color: 'red' };
  } else if (positiveRating < 0.4) {
    return { label: 'Mostly negative', color: 'orange' };
  } else if (positiveRating < 0.7) {
    return { label: 'Mixed', color: 'yellow' };
  } else if (positiveRating < 0.8) {
    return { label: 'Mostly Positive', color: 'lime' };
  } else {
    if (totalCount < 50) return { label: 'Positive', color: 'green' };
    else if (totalCount < 500) return { label: 'Very Positive', color: 'green' };
    else if (totalCount >= 500 && positiveRating < 0.95)
      return { label: 'Very Positive', color: 'green' };
    else return { label: 'Overwhelmingly Positive', color: 'green' };
  }
}

const DetailCard = ({ model, version }: DetailCardProps) => {
  const [expand, setExpand] = useState(true);
  const thumbsUpCount = version.rank?.thumbsUpCountAllTime ?? 0;
  const thumbsDownCount = version.rank?.thumbsDownCountAllTime ?? 0;
  const totalCount = thumbsUpCount + thumbsDownCount;
  const positiveRating = totalCount > 0 ? thumbsUpCount / totalCount : 0;

  const { label } =
    totalCount === 0
      ? {
          label: (
            <div className="capitalize text-sm text-defaultText font-semibold text-center">
              No reviews yet
            </div>
          ),
        }
      : getRatingLabel({ positiveRating, totalCount });

  return (
    <div className="rounded-lg border border-solid border-secondaryBorder bg-secondaryBg text-defaultText">
      <div className="flex items-center justify-between h-16 pl-5 pr-4">
        <div className="flex gap-2">
          <IconMenu2 size={24} />
          <span className="font-semibold text-base">Detail</span>
        </div>
        <div
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {expand ? <IconChevronDown size={24} /> : <IconChevronUp size={24} />}
        </div>
      </div>
      <div
        className={`${
          !expand ? 'hidden' : 'border-t border-solid border-secondaryBorder'
        } py-5 flex flex-col gap-5`}
      >
        <div className="flex items-center justify-between px-5">
          <span className="capitalize text-sm text-secondaryText font-semibold text-left">
            Type
          </span>
          <span className="capitalize text-sm text-defaultText font-semibold text-right">
            {getDisplayName(model.type)} {model.checkpointType}
          </span>
        </div>
        <div className="flex items-center justify-between px-5">
          <span className="capitalize text-sm text-secondaryText font-semibold text-left">
            Stats
          </span>
          <div className="flex gap-2.5 capitalize text-sm text-defaultText font-semibold">
            <div className="flex items-center gap-1">
              <IconDownload size={16} />
              {(version?.rank?.downloadCountAllTime ?? 0).toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <IconBrush size={16} />
              {(version?.rank?.generationCountAllTime ?? 0).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-5">
          <span className="capitalize text-sm text-secondaryText font-semibold text-left">
            Reviews
          </span>
          <span className="capitalize text-sm text-defaultText font-semibold text-right">
            {label}
          </span>
        </div>
        <div className="flex items-center justify-between px-5">
          <span className="capitalize text-sm text-secondaryText font-semibold text-left">
            Uploaded
          </span>
          <span className="capitalize text-sm text-defaultText font-semibold text-right">
            {formatDate(version.createdAt)}
          </span>
        </div>
        <div className="flex items-center justify-between px-5">
          <span className="capitalize text-sm text-secondaryText font-semibold text-left">
            Base Model
          </span>
          <span className="capitalize text-sm text-defaultText font-semibold text-right">
            {version.baseModel}
          </span>
        </div>
        <div className="flex items-center justify-between px-5">
          <span className="capitalize text-sm text-secondaryText font-semibold text-left">
            Training
          </span>
          <span className="flex items-center gap-2 capitalize text-sm text-defaultText font-semibold">
            <span>Step: {version?.steps?.toLocaleString() || 0}</span>
            <span>Epoch: {version?.epochs?.toLocaleString() || 0}</span>
          </span>
        </div>
        <div className=" border-t border-solid border-secondaryBorder"></div>

        <div className="flex items-center justify-between px-5">
          <span className="capitalize text-sm text-secondaryText font-semibold text-left">
            Owner
          </span>
          <div
            title={version.walletAddr}
            className="max-w-200 capitalize text-sm text-defaultText font-semibold text-right overflow-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
            onClick={() => copy(version.walletAddr)}
          >
            {version.walletAddr}
          </div>
        </div>
        <div className="flex items-center justify-between px-5">
          <span className="capitalize text-sm text-secondaryText font-semibold text-left">
            Hash
          </span>
          <div
            title={version.hashCID}
            className="max-w-200 capitalize text-sm text-defaultText font-semibold text-right overflow-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
            onClick={() => copy(version.hashCID)}
          >
            {version.hashCID}
          </div>
        </div>
        <div className="flex items-center justify-between px-5">
          <span className="capitalize text-sm text-secondaryText font-semibold text-left">CID</span>
          <div
            title={version.modelCID}
            className="max-w-200 capitalize text-sm text-defaultText font-semibold text-right overflow-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
            onClick={() => copy(version.modelCID)}
          >
            {version.modelCID}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
