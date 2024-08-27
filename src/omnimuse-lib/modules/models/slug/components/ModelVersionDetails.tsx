import React, { useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Group, MantineTheme, Stack, Tooltip, Button, Image } from '@mantine/core';
import XIconButton from '~/omnimuse-lib/components/XButton/XIconButton';
import XButton from '~/omnimuse-lib/components/XButton';
import { CollectionType, ModelModifier } from '~/types/prisma/schema';
import {
  IconShare3,
  IconStar,
  IconStarFilled,
  IconDownload,
  IconEdit,
  TablerIconsProps,
  IconFilePercent,
  IconFileReport,
  IconShoppingBag,
} from '@tabler/icons-react';
import { ContentClamp } from '~/components/ContentClamp/ContentClamp';
import { ModelCarousel } from '~/components/Model/ModelCarousel/ModelCarousel';
import DetailCard from '~/omnimuse-lib/modules/models/slug/components/DetailCard';
import { RenderHtml } from '~/components/RenderHtml/RenderHtml';
import { GenerateButton } from '~/components/RunStrategy/GenerateButton';
import { ShareButton } from '~/components/ShareButton/ShareButton';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';
import { ThumbsUpIcon } from '~/components/ThumbsIcon/ThumbsIcon';
import OtherUserCard from '~/omnimuse-lib/features/user/OtherUserCard';
import { IModel, IModelVersions } from '~/request/api/model/type';
import { getModelOperationCounts } from '~/request/api/model/behavior';
import { likeModel, collectModel } from '~/request/api/user/index';
import { useModelStore } from '~/store/model.store';
import { useCommonStore } from '~/store/common.store';
import { triggerRoutedDialog } from '~/components/Dialog/RoutedDialogProvider';
import { TAppealStatus } from '~/request/api/model/type';

export function ModelVersionDetails({ model, version, isOwner, onBrowseClick }: Props) {
  const router = useRouter();
  const canGenerate = version.canGenerate;
  const setRefreshOtherUserInfoKey = useCommonStore((state) => state.setRefreshOtherUserInfoKey);
  const setTotalCounts = useModelStore((state) => state.setTotalCounts);
  const appealStatus = useModelStore((state) => state.appealStatus);
  const setAppealStatus = useModelStore((state) => state.setAppealStatus);
  useEffect(() => {
    if (version.status || version.auditType) {
      setAppealStatus((version.auditType || version.status) as TAppealStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version?.status, version.auditType]);
  const refreshModelTotalCountKey = useModelStore((state) => state.refreshModelTotalCountKey);
  const setRefreshModelTotalCountKey = useModelStore((state) => state.setRefreshModelTotalCountKey);

  const handleUpdateTotalCounts = async (modelId: number) => {
    const res = await getModelOperationCounts(modelId);
    if (res.code === 200 && res.result) {
      const {
        totalcollectcount,
        totaldownloadcount,
        totalgeneratecount,
        totalstarcount,
        totalrewardcount,
      } = res.result;
      setTotalCounts({
        like: totalstarcount || 0,
        collect: totalcollectcount || 0,
        download: totaldownloadcount || 0,
        generate: totalgeneratecount || 0,
        reward: totalrewardcount || 0,
      });
      // 更新user卡片信息
      setRefreshOtherUserInfoKey();
    }
  };
  const likeModelIds = useModelStore((state) => state.likeModelIds);
  const setLikeModelIds = useModelStore((state) => state.setLikeModelIds);
  const isFavorite = useMemo(() => {
    return likeModelIds.includes(version?.id);
  }, [likeModelIds, version?.id]);

  const collectModelIds = useModelStore((state) => state.collectModelIds);
  const setCollectModelIds = useModelStore((state) => state.setCollectModelIds);
  const isCollect = useMemo(() => {
    return collectModelIds.includes(version?.id);
  }, [collectModelIds, version?.id]);

  const handleToggleFavorite = async ({
    versionId,
    setTo,
  }: {
    versionId?: number;
    setTo: boolean;
  }) => {
    const modelId = model?.id;
    const operation = setTo;
    const modelVersionId = versionId;
    if (modelId && modelVersionId) {
      const res = await likeModel({ contentId: modelVersionId, type: 1, operation });
      if (res.code === 200) {
        if (operation) {
          setLikeModelIds([...likeModelIds, modelVersionId]);
        } else {
          const ids = likeModelIds.filter((id) => id !== modelVersionId);
          setLikeModelIds(ids);
        }
        setRefreshModelTotalCountKey();
      }
    }
  };

  const handleCollect = async () => {
    const modelId = model?.id;
    const modelVersionId = version?.id;
    const operation = !isCollect;
    if (modelId && modelVersionId) {
      const res = await collectModel({ contentId: modelVersionId, type: 1, operation });
      if (res.code === 200) {
        if (operation) {
          setCollectModelIds([...collectModelIds, modelVersionId]);
        } else {
          const ids = collectModelIds.filter((id) => id !== modelVersionId);
          setCollectModelIds(ids);
        }
        setRefreshModelTotalCountKey();
      }
    }
  };

  useEffect(() => {
    if (refreshModelTotalCountKey && model?.id) {
      handleUpdateTotalCounts(model?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshModelTotalCountKey, model?.id]);

  return (
    <ContainerGrid gutter="xl">
      <ContainerGrid.Col xs={12} md={4} orderMd={2}>
        <Stack>
          <Stack spacing={4}>
            <Group spacing="xs" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              {isOwner ? (
                <>
                  {/* 编辑按钮 */}
                  <XButton
                    type="primary"
                    className="flex-1"
                    innerClassName="flex justify-center items-center gap-1"
                    onClick={() => {
                      router.push(`/models/create?id=${model.id}`);
                    }}
                  >
                    <IconEdit />
                    <span>Edit</span>
                  </XButton>
                  {/* 主态页创建按钮 */}
                  {appealStatus === 'audit_pass' && canGenerate && (
                    <GenerateButton
                      iconOnly={false}
                      modelVersionId={version.id}
                      data-activity="create:model"
                      buttonType="default"
                      className="w-auto"
                    />
                  )}

                  {appealStatus === 'audit_fail' && (
                    <XIconButton
                      onClick={() => {
                        triggerRoutedDialog({
                          name: 'AppealModal',
                          state: {
                            modelVersionId: version.id,
                          },
                        });
                      }}
                      icon={() => <IconFilePercent />}
                    />
                  )}
                  {appealStatus === 'appeal' && (
                    <XIconButton icon={() => <IconFileReport className="" />}>
                      <span className="text-[16px] ml-2">Appeal submitted</span>
                    </XIconButton>
                  )}
                  {appealStatus === 'appeal_fail' && (
                    <XIconButton icon={() => <IconFilePercent className="" />}>
                      <span className="text-[16px] ml-2">Appeal failed</span>
                    </XIconButton>
                  )}
                </>
              ) : (
                <>
                  {/* 创建按钮 */}
                  {canGenerate && (
                    <GenerateButton
                      iconOnly={false}
                      modelVersionId={version.id}
                      data-activity="create:model"
                    />
                  )}

                  {/* 下载按钮 */}
                  <LoginRedirect reason="add-to-collection">
                    <XIconButton
                      onClick={() => {
                        triggerRoutedDialog({
                          name: 'payConfirm',
                          state: {
                            type: 'downloadModel',
                            contentId: version.id,
                            creditCount: version.credit,
                          },
                        });
                      }}
                      icon={() => <IconDownload />}
                    ></XIconButton>
                  </LoginRedirect>

                  {/* 收藏 */}
                  <LoginRedirect reason="add-to-collection">
                    <XIconButton
                      className={isCollect ? 'text-yellow-400' : ''}
                      icon={isCollect ? () => <IconStarFilled /> : () => <IconStar />}
                      onClick={() => {
                        handleCollect();
                      }}
                    ></XIconButton>
                  </LoginRedirect>

                  {/* 点赞按钮 */}
                  <Tooltip label={isFavorite ? 'Unlike' : 'Like'} position="top" withArrow>
                    <div>
                      <LoginRedirect reason="favorite-model">
                        <XIconButton
                          icon={(props: TablerIconsProps) => (
                            <ThumbsUpIcon {...props} filled={isFavorite} />
                          )}
                          onClick={() =>
                            handleToggleFavorite({ versionId: version.id, setTo: !isFavorite })
                          }
                          className={isFavorite ? 'text-red-600' : ''}
                        ></XIconButton>
                      </LoginRedirect>
                    </div>
                  </Tooltip>
                </>
              )}

              {/* 分享按钮 */}
              {version.status === 'publish' && (
                <Tooltip label="Share" position="top" withArrow>
                  <div>
                    <ShareButton
                      url={router.asPath}
                      title={model.name}
                      collect={{ modelId: model.id, type: CollectionType.Model }}
                    >
                      <XIconButton
                        icon={(props: TablerIconsProps) => <IconShare3 {...props} />}
                      ></XIconButton>
                    </ShareButton>
                  </div>
                </Tooltip>
              )}

              {/* 购买按钮 */}
              {version.status === 'publish' && version.allowSell && !isOwner && (
                <XIconButton
                  icon={(props: TablerIconsProps) => <IconShoppingBag {...props} />}
                  onClick={() => {
                    console.log(version);
                    const state: any = {
                      type: 'buyModel',
                      contentId: version.id,
                      creditCount: version.purchaseCredit,
                      data: {
                        modelId: model.id,
                        versionId: version.id,
                        balance: version.purchaseCredit,
                        authorId: model.user.id,
                      },
                    };
                    triggerRoutedDialog({
                      name: 'buyModel',
                      state,
                    });
                  }}
                ></XIconButton>
              )}
            </Group>
          </Stack>

          {/* 模型主体信息卡片 */}
          <DetailCard model={model} version={version} />

          {!isOwner && (
            <div className="w-full">
              <Button
                styles={{
                  root: {
                    height: '44px',
                  },
                }}
                fullWidth
                leftIcon={<Image src="/images/icon/stop.svg" width={22} height={22} alt="" />}
                variant="gradient"
                gradient={{ from: '#9A5DFF', to: '#7760FF' }}
                onClick={() => {
                  triggerRoutedDialog({
                    name: 'reward',
                    state: { amount: 10, id: version.id, type: 'model' },
                  });
                }}
              >
                Reward
              </Button>
            </div>
          )}

          {/* 模型创建者信息 */}
          {!isOwner && <OtherUserCard userId={model.user.id} />}
        </Stack>
      </ContainerGrid.Col>
      {/* 模型轮播图和描述信息 */}
      <ContainerGrid.Col
        xs={12}
        md={8}
        orderMd={1}
        sx={(theme: MantineTheme) => ({
          [containerQuery.largerThan('xs')]: {
            padding: `0 ${theme.spacing.sm}px`,
            margin: `${theme.spacing.sm}px 0`,
          },
        })}
      >
        {model.mode !== ModelModifier.TakenDown && (
          <ModelCarousel modelVersionId={version.id} onBrowseClick={onBrowseClick} />
        )}
        {model.description ? (
          <ContentClamp className="mt-6" maxHeight={300}>
            <RenderHtml html={model.description} withMentions />
          </ContentClamp>
        ) : null}
      </ContainerGrid.Col>
    </ContainerGrid>
  );
}

type Props = {
  version: IModelVersions;
  model: IModel;
  isOwner: boolean;
  onBrowseClick?: VoidFunction;
};
