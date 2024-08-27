import { Button, Container, Divider, Group, Stack, Text, Title, Box, Image } from '@mantine/core';
import { IconDownload, IconPlus, IconBrush, IconStar, IconHeart } from '@tabler/icons-react';
import XBadge from '~/omnimuse-lib/components/XBadge';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { NotFound } from '~/components/AppLayout/NotFound';
import ImagesAsPostsInfinite from '~/components/Image/AsPosts/ImagesAsPostsInfinite';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';
import { ModelDiscussionV2 } from '~/components/Model/ModelDiscussion/ModelDiscussionV2';
import { ModelVersionList } from '~/omnimuse-lib/modules/models/slug/components/modelVersionList';
import { ModelVersionDetails } from '~/omnimuse-lib/modules/models/slug/components/ModelVersionDetails';
import { PageLoader } from '~/components/PageLoader/PageLoader';
import { formatDate } from '~/utils/date-helpers';
import { abbreviateNumber } from '~/utils/number-helpers';
import { triggerRoutedDialog } from '~/components/Dialog/RoutedDialogProvider';
import ModelDetailMeta from '~/omnimuse-lib/modules/models/slug/components/ModelDetailMeta';
import useStyles from '~/omnimuse-lib/modules/models/slug/components/useStyles';
import { getModelDetailById } from '~/request/api/model';
import { getModelStarsAndCollects } from '~/request/api/model/behavior';
import { IModel, IModelVersions, TAppealStatus } from '~/request/api/model/type';
import { useModelStore } from '~/store/model.store';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';

const IconActionBadge = ({
  text = '',
  className = '',
  onClick,
  children,
}: {
  text?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  const { classes } = useStyles();

  return (
    <div
      className={`flex items-center gap-1 font-medium cursor-pointer text-defaultText ${classes.modelBadgeText} ${className}`}
      onClick={() => onClick?.()}
    >
      {children}
      {text && <span>{text}</span>}
    </div>
  );
};

const ModelDetailsPage = ({ id }: { id: number }) => {
  const { getIsOwner, currentUser } = useUserInfo();

  const router = useRouter();
  const { classes } = useStyles();

  const discussionSectionRef = useRef<HTMLDivElement | null>(null);
  const gallerySectionRef = useRef<HTMLDivElement | null>(null);

  const [model, setModel] = useState<IModel | null>(null);
  const [loadingModel, setLoadingModel] = useState(true);

  const isOwner = useMemo(() => {
    const getOwner = getIsOwner();
    return getOwner(model?.user?.id) && !!router.query?.status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.user?.id, router.query?.status, getIsOwner]);

  const modelVersionId = useMemo(() => {
    const rawVersionId = router.query.modelVersionId;
    return Number(
      (Array.isArray(rawVersionId) ? rawVersionId[0] : rawVersionId) ?? model?.modelVersions[0]?.id
    );
  }, [router.query?.modelVersionId, model?.modelVersions]);

  const publishedVersions = useMemo(() => {
    return model?.modelVersions ?? [];
  }, [model?.modelVersions]);

  const latestVersion = useMemo(() => {
    return (
      publishedVersions.find((version) => version.id === modelVersionId) ??
      publishedVersions[0] ??
      null
    );
  }, [publishedVersions, modelVersionId]);

  const [selectedVersion, setSelectedVersion] = useState<IModelVersions | null>(latestVersion);

  // 需要根据模型详情获取图片的接口
  const setTotalCounts = useModelStore((state) => state.setTotalCounts);
  const totalCounts = useModelStore((state) => state.totalCounts);
  const setLikeModelIds = useModelStore((state) => state.setLikeModelIds);
  const setCollectModelIds = useModelStore((state) => state.setCollectModelIds);
  const handleGetModelDetail = async (id: number, status?: TAppealStatus) => {
    setLoadingModel(true);
    const { code, result } = await getModelDetailById(id, status).finally(() => {
      setLoadingModel(false);
    });
    if (code === 200) {
      setModel(result);
      // 点赞数、下载数、收藏数、生成数都使用store中的数据，第一次的时候使用详情里面的数据设置store，后续当用户操作成功时，再调用统计数据查询接口更新store数据
      const { rank } = result;
      setTotalCounts({
        like: rank?.thumbsUpCountAllTime || 0,
        collect: rank?.collectedCountAllTime || 0,
        download: rank?.downloadCountAllTime || 0,
        generate: rank?.generationCountAllTime || 0,
        reward: rank?.rewardCountAllTime || 0,
      });
    }
  };

  const getStarsAndCollects = async (id: number) => {
    const res = await getModelStarsAndCollects(id);
    if (res.code === 200) {
      setLikeModelIds(res.result.stars ?? []);
      setCollectModelIds(res.result.collects ?? []);
    }
  };

  useEffect(() => {
    // Change the selected modelVersion based on querystring param
    const queryVersion = publishedVersions.find((v) => v.id === modelVersionId);
    const hasSelected = publishedVersions.some((v) => v.id === selectedVersion?.id);
    if (!hasSelected) setSelectedVersion(publishedVersions[0] ?? null);
    const statusStr = router.query?.status ? `&status=${router.query?.status}` : '';
    if (selectedVersion && queryVersion !== selectedVersion) {
      router.replace(`/models/${id}?modelVersionId=${selectedVersion.id}${statusStr}`, undefined, {
        shallow: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, publishedVersions, selectedVersion, modelVersionId, router.query?.status]);

  useEffect(() => {
    if (id) {
      const status = router.query?.status as TAppealStatus;
      handleGetModelDetail(id, status);
      // 进入页面将点赞、收藏的模型版本ids更新到store中
      currentUser && getStarsAndCollects(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router.query?.status, currentUser?.address]);

  if (loadingModel) return <PageLoader />;

  if (!model) return <NotFound />;

  const category = model.tagsOnModels.find(({ tag }) => !!tag.isCategory)?.tag;
  const tags = model.tagsOnModels.filter(({ tag }) => !tag.isCategory).map((tag) => tag.tag);

  return (
    <>
      {/* meta 信息, seo */}
      {!!selectedVersion && (
        <>
          <ModelDetailMeta model={model} versionName={selectedVersion?.name} />
          {/* 模型详情主体内容 */}
          <Container className="pt-3" size="xl">
            <Stack spacing="xl">
              <Stack spacing="xs">
                <Stack spacing={16}>
                  {/* 标题、点赞数、下载数、收藏数、在线生成数 */}
                  <Group align="flex-start" sx={{ justifyContent: 'space-between' }} noWrap>
                    <Group className={classes.titleWrapper} align="center">
                      <Title className={classes.title} order={1} lineClamp={2}>
                        {model?.name}
                      </Title>
                      <IconActionBadge
                        className={'cursor-text'}
                        text={abbreviateNumber(totalCounts.like)}
                      >
                        <IconHeart size={18} />
                      </IconActionBadge>
                      <IconActionBadge
                        className="cursor-text"
                        text={abbreviateNumber(totalCounts.download)}
                      >
                        <IconDownload size={18} />
                      </IconActionBadge>
                      <IconActionBadge
                        className="cursor-text"
                        text={abbreviateNumber(totalCounts.collect)}
                      >
                        <IconStar size={18} />
                      </IconActionBadge>

                      <IconActionBadge
                        className="cursor-text"
                        text={abbreviateNumber(totalCounts.reward)}
                      >
                        <Image src="/images/icon/gold.svg" alt="" />
                      </IconActionBadge>

                      <IconActionBadge
                        className="cursor-text"
                        text={abbreviateNumber(totalCounts.generate)}
                      >
                        <IconBrush size={18} />
                      </IconActionBadge>
                    </Group>
                  </Group>
                  {/* 更新时间 */}
                  <Group spacing={8}>
                    <Text size="md" color="#9B9C9E">
                      Updated: {formatDate(model.updatedAt)}
                    </Text>

                    <div className="w-[1px] h-5 bg-divideBorder"></div>

                    {/* 类别高亮 */}
                    {category && (
                      <>
                        <XBadge className="cursor-text" size="sm" isActive={true}>
                          {category.name}
                        </XBadge>
                        <div className="w-[1px] h-5 bg-divideBorder"></div>
                      </>
                    )}

                    {/* 未高亮类别 */}
                    {tags.map((tag) => {
                      return (
                        <XBadge key={tag.id} className="cursor-text" size="sm">
                          {tag.name}
                        </XBadge>
                      );
                    })}
                  </Group>
                </Stack>
              </Stack>

              {/* 版本列表 */}
              <Group className="pt-1.5" spacing={10} noWrap>
                <ModelVersionList
                  versions={model.modelVersions}
                  selected={selectedVersion?.id}
                  onVersionClick={(version) => {
                    if (version.id !== selectedVersion?.id) {
                      setSelectedVersion(version);
                    }
                  }}
                />
              </Group>

              {/* 模型详情主体内容 */}
              <ModelVersionDetails
                model={model}
                version={selectedVersion}
                isOwner={isOwner}
                onBrowseClick={() => {
                  gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </Stack>
          </Container>

          {/* 评论模块 */}
          <Container size="xl" mb="xl" className="mt-[60px]">
            <Stack spacing="md">
              <Group ref={discussionSectionRef} sx={{ justifyContent: 'space-between' }}>
                <Group spacing="xs">
                  <Title order={2}>Discussion</Title>
                  <LoginRedirect reason="create-comment">
                    <Button
                      leftIcon={<IconPlus size={16} />}
                      variant="outline"
                      onClick={() =>
                        triggerRoutedDialog({
                          name: 'commentEdit',
                          state: { contentId: String(id), type: 1 },
                        })
                      }
                      size="xs"
                      styles={() => ({
                        root: {
                          borderRadius: '8px',
                          border: '1px solid #9A5DFF',
                          padding: '6px 10px',
                        },
                      })}
                    >
                      Add Comment
                    </Button>
                  </LoginRedirect>
                </Group>
              </Group>
              {/* 评论列表 */}
              <ModelDiscussionV2 contentId={String(model.id)} type={1} />
            </Stack>
          </Container>

          <Divider className="my-[60px] mb-[20px]" />

          {/* 画廊模块 */}
          <Box ref={gallerySectionRef} id="gallery" mt="md" className="flex justify-center w-full">
            <ImagesAsPostsInfinite
              model={model}
              selectedVersionId={selectedVersion?.id}
              modelVersions={model.modelVersions}
              showModerationOptions={isOwner}
              showPOIWarning={model.poi}
              canReview={true}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default ModelDetailsPage;
