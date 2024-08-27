import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  createStyles,
  BadgeProps,
  Tooltip,
  Accordion,
  SimpleGrid,
  Image,
  Flex,
} from '@mantine/core';
import { InferGetServerSidePropsType } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import XIconButton from '~/omnimuse-lib/components/XButton/XIconButton';
// import { Meta } from '~/components/Meta/Meta';
import { RenderHtml } from '~/components/RenderHtml/RenderHtml';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { formatDate } from '~/utils/date-helpers';
import { removeEmpty } from '~/utils/object-helpers';
import { ShareButton } from '~/components/ShareButton/ShareButton';
import {
  IconHeart,
  IconStar,
  IconFile,
  IconHeartFilled,
  IconStarFilled,
} from '@tabler/icons-react';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';
import { useRouter } from 'next/router';
import { abbreviateNumber } from '~/utils/number-helpers';
import { AttachmentCard } from '~/components/DataSet/AttachmentCard';
import { ContentClamp } from '~/components/ContentClamp/ContentClamp';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import { ImageViewer } from '~/components/ImageViewer/ImageViewer';
import { IconBadge } from '~/components/IconBadge/IconBadge';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { ScrollAreaMain } from '~/components/ScrollArea/ScrollAreaMain';
import { likeModel, collectModel } from '~/request/api/user';
import OtherUserCard from '~/omnimuse-lib/features/user/OtherUserCard';
import { getDatasetDetail } from '~/request/api/data-set';
import { getDownloadUrl } from '~/request/api/user';
import { CommentProvider } from '~/components/CommentSection/CommentProvider';
import { CommentSection } from '~/components/CommentSection/CommentSection';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import XButton from '~/omnimuse-lib/components/XButton';
import { PageLoader } from '~/components/PageLoader/PageLoader';
import { AttachmentItem } from '~/request/api/data-set/type';
import RewardButton from '~/components/RewardButton/RewardButton';
import { ResultEdit } from '~/request/api/data-set/type';
import * as apiUrl from '~/pages/api/apiUrl';

// const querySchema = z.object({
//   id: z.coerce.number(),
//   slug: z.array(z.string()).optional(),
// });

export async function getServerSideProps(context: any) {
  // const response = await fetch(apiUrl.getDataSetDetails, {
  //   method: 'POST',
  //   body: JSON.stringify({ id: context.query.id }),
  // });
  // const resultData = await response.json();

  // console.log('result', resultData);
  return {
    props: {
      id: context.query.id,
      // dataSetResult: resultData.result,
    },
  };
}

type reslutObj = {
  type: string;
  count: number;
};

export default function BountyDetailsPage({
  id,
}: // dataSetResult,
InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { classes } = useStyles();
  const [bounty, setBounty] = useState<ResultEdit | any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const discussionSectionRef = useRef<HTMLDivElement>(null);
  const [reward, setReward] = useState<number>(0);
  const [favoriteTotal, setFavoriteTotal] = useState<number>(0);
  const [collectedTotal, setCollectedTotal] = useState<number>(0);
  // console.log(dataSetResult);
  useEffect(() => {
    upDataDatasetDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultBadgeProps: BadgeProps = {
    radius: 'sm',
    size: 'lg',
    sx: { cursor: 'pointer' },
  };

  // 更新数据集详情
  const upDataDatasetDetail = async (): Promise<void> => {
    setLoading(true);
    const res = await getDatasetDetail({ id });
    if (res.code === 200) {
      setBounty({ ...res.result });
      setReward(res.result.rewardCount);
      setFavoriteTotal(res.result.likeCount);
      setCollectedTotal(res.result.starCount);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  // 更新详情数据
  const handleMessageFromChild = (data: reslutObj) => {
    // console.log(data);
    if (data?.type === 'favorite') {
      // 点赞
      setFavoriteTotal(data.count);
    } else if (data?.type === 'collected') {
      // 收藏
      setCollectedTotal(data.count);
    }
    if (!data) {
      // 其它
      upDataDatasetDetail();
    }
  };
  const iconStyle = {
    root: {
      backgroundColor: 'transparent',
      padding: '0px',
    },
  };

  // 改变打赏数
  const rewardhandler = (rewardCount: number) => {
    setReward(rewardCount);
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {/* {meta} */}
          <Container size="xl" mb={32}>
            <Stack spacing="xs" mb="xl">
              <Group position="apart" className={classes.titleWrapper} noWrap>
                <Group spacing="xs" style={{ marginTop: '20px' }}>
                  <Title weight="bold" className={classes.title} lineClamp={2} order={1}>
                    {bounty.name}
                  </Title>
                  <Group spacing={8}>
                    <LoginRedirect reason="perform-action">
                      <IconBadge
                        {...defaultBadgeProps}
                        icon={<IconHeart size={18} />}
                        styles={iconStyle}
                      >
                        {abbreviateNumber(favoriteTotal)}
                      </IconBadge>
                    </LoginRedirect>
                    <IconBadge
                      {...defaultBadgeProps}
                      styles={iconStyle}
                      icon={<Image src="/images/icon/download.svg" alt="" />}
                      onClick={() => {
                        discussionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {abbreviateNumber(bounty?.downloadCount ?? 0)}
                    </IconBadge>
                    <IconBadge
                      {...defaultBadgeProps}
                      styles={iconStyle}
                      icon={<IconStar size={18} />}
                      sx={undefined}
                    >
                      {/* collectedTotal */}
                      {abbreviateNumber(collectedTotal)}
                    </IconBadge>
                    <LoginRedirect reason="perform-action">
                      <IconBadge
                        {...defaultBadgeProps}
                        styles={iconStyle}
                        icon={<Image src="/images/icon/gold.svg" alt="" />}
                      >
                        {abbreviateNumber(reward)}
                      </IconBadge>
                    </LoginRedirect>
                  </Group>
                </Group>
              </Group>
              <Group spacing={8}>
                <Text color="dimmed" size="xs">
                  {formatDate(bounty.createdAt, undefined, true)}
                </Text>
              </Group>
            </Stack>
            <ContainerGrid gutterMd={32} gutterLg={30}>
              <ContainerGrid.Col xs={12} md={4} orderMd={2}>
                {bounty?.id && (
                  <BountySidebar
                    bounty={bounty}
                    sendMessageToParent={handleMessageFromChild}
                    onRewardCount={rewardhandler}
                  />
                )}
              </ContainerGrid.Col>
              <ContainerGrid.Col xs={12} md={8} orderMd={1}>
                <Stack spacing="xs">
                  <article>
                    <Stack spacing={4}>
                      {bounty.note && (
                        <ContentClamp maxHeight={544}>
                          <RenderHtml html={bounty.note} />
                        </ContentClamp>
                      )}
                    </Stack>
                  </article>
                </Stack>
              </ContainerGrid.Col>
            </ContainerGrid>
          </Container>

          <Container size="xl" my="xl">
            <Stack spacing="md">
              <Group ref={discussionSectionRef} sx={{ justifyContent: 'space-between' }}>
                <Group spacing="xs">
                  <Title order={2}>Discussion</Title>
                </Group>
              </Group>
              {bounty?.id && (
                <CommentProvider modelId={bounty?.id} type={3}>
                  <CommentSection />
                </CommentProvider>
              )}
            </Stack>
          </Container>
        </>
      )}
    </>
  );
}

type createAttachmentItem = {
  id: number | string;
  icon: string;
  name: string;
  sizeKB: number | string;
  hash: string;
  format: string;
  url: string;
};
const BountySidebar = ({
  bounty,
  sendMessageToParent,
  onRewardCount,
}: {
  bounty: ResultEdit;
  sendMessageToParent: (data: reslutObj) => void;
  onRewardCount: (count: number) => void;
}) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [isfollowed, setIsFollowed] = useState<number | boolean>(bounty.isLike);
  const [isCollect, setIsCollect] = useState<number | boolean>(bounty.isStar);

  const attachments: createAttachmentItem[] =
    bounty?.attachment?.length > 0
      ? bounty?.attachment?.map((item: AttachmentItem) => {
          const itemObjt: createAttachmentItem = {
            id: bounty.id,
            icon: 'folder',
            name: item.filename,
            sizeKB: item.fileSize,
            hash: item.fileHash,
            format: item.fileFormat,
            url: 'https://text/download' + '.' + item.fileFormat,
          };
          return itemObjt;
        })
      : [];

  const updatEparentComponent = (data?: reslutObj): void => {
    data && sendMessageToParent(data);
  };

  // 点赞
  const handleToggleFavorite = async ({
    versionId,
    setTo,
  }: {
    versionId?: number;
    setTo: boolean;
  }) => {
    const modelId = bounty?.id;
    const operation = setTo;
    const modelVersionId = versionId;
    if (modelId && modelVersionId) {
      const res = await likeModel({ contentId: modelVersionId, type: 4, operation });
      if (res.code === 200) {
        const resultObj: reslutObj = {
          type: 'favorite',
          count: res.result.count,
        };
        if (setTo) {
          setIsFollowed(1);
        } else {
          setIsFollowed(0);
        }
        updatEparentComponent(resultObj);
      }
    }
  };

  // 收藏
  const handleCollect = async () => {
    // const modelId = model?.id;
    const modelVersionId = bounty?.id;
    const operation = !isCollect;
    if (modelVersionId) {
      const res = await collectModel({ contentId: modelVersionId, type: 4, operation });
      if (res.code === 200) {
        const resultObj: reslutObj = {
          type: 'collected',
          count: res.result.count,
        };
        if (operation) {
          setIsCollect(true);
        } else {
          setIsCollect(false);
        }
        updatEparentComponent(resultObj);
      }
    }
  };

  const clickCopyHandle = () => {
    if (attachments.length > 0) {
      getDownloadLink(attachments[0].id, attachments[0].name);
    }
  };

  const [opened, setopen] = useState(false);
  const [url, setUrl] = useState('');

  const handleConfirm = () => {
    window.open(url, '_black');
  };
  // 请求下载链接
  const getDownloadLink = async (id: number | string, name: string) => {
    const res = await getDownloadUrl({ id: id, type: 'dataset' });
    if (res.code === 200) {
      setopen(true);
      setUrl(res.result.urls[name]);
    }
  };
  const parentMethod = () => {
    updatEparentComponent();
  };
  const linkCreate = () => {
    router.push('/data-set/create?id=' + router.query.id);
  };

  const getResult = (count: number) => {
    onRewardCount(count);
  };

  return (
    <Stack spacing="md">
      <MantineModal width={757} title="Download" opened={opened} onClose={() => setopen(false)}>
        <div className="pt-[50px] px-[50px] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <Image alt="coin" className="!w-[32px]" src="/images/icon/gold.svg" />
            <span className="text-[26px] text-coinText text-nowrap font-medium">0</span>
          </div>
          <span className="text-defaultText text-sm">You can download it for free</span>
          <XButton
            type="primary"
            className={`mt-[50px] mb-[50px] !rounded-[40px] w-[388px]`}
            onClick={() => {
              handleConfirm();
            }}
          >
            Get Download Url
          </XButton>
        </div>
      </MantineModal>
      <Group spacing={8} noWrap>
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="nowrap"
          style={{ width: '100%' }}
        >
          {router.query.type === 'edit' ? (
            <div style={{ width: '89%' }}>
              <Button
                variant="gradient"
                gradient={{ from: '#9A5DFF', to: '#7760FF' }}
                fullWidth
                styles={{
                  root: {
                    height: '44px',
                  },
                }}
                leftIcon={<Image src="/images/icon/edit.svg" width={18} height={18} alt="" />}
                onClick={linkCreate}
              >
                Edit
              </Button>
            </div>
          ) : (
            <>
              <LoginRedirect reason="data-set-download">
                <Button
                  variant="gradient"
                  gradient={{ from: '#9A5DFF', to: '#7760FF' }}
                  fullWidth
                  styles={{
                    root: {
                      height: '44px',
                      width: '58%',
                    },
                  }}
                  leftIcon={<Image src="/images/icon/download.svg" alt="" />}
                  onClick={clickCopyHandle}
                >
                  Download
                </Button>
              </LoginRedirect>
              <Tooltip label={isfollowed ? 'Unlike' : 'Like'} position="top">
                <div>
                  <LoginRedirect reason="add-to-collection">
                    <XIconButton
                      className={isfollowed ? 'text-red-600' : ''}
                      icon={isfollowed ? () => <IconHeartFilled /> : () => <IconHeart />}
                      onClick={() =>
                        handleToggleFavorite({ versionId: bounty.id, setTo: !isfollowed })
                      }
                    ></XIconButton>
                  </LoginRedirect>
                </div>
              </Tooltip>
              <Tooltip label={isCollect ? 'Collected' : 'Not collected'} position="top">
                <div>
                  <LoginRedirect reason="add-to-collection">
                    <XIconButton
                      className={isCollect ? 'text-yellow-400' : ''}
                      icon={isCollect ? () => <IconStarFilled /> : () => <IconStar />}
                      onClick={() => {
                        handleCollect();
                      }}
                    ></XIconButton>
                  </LoginRedirect>
                </div>
              </Tooltip>
            </>
          )}

          <Tooltip label="Share" position="top">
            <div style={{ marginLeft: 'auto' }}>
              <ShareButton url={router.asPath} title={bounty.name}>
                <XIconButton
                  className={isCollect ? 'text-yellow-400' : ''}
                  icon={() => <Image src="/images/icon/share.svg" width={20} height={20} alt="" />}
                  onClick={() => {
                    handleCollect();
                  }}
                ></XIconButton>
              </ShareButton>
            </div>
          </Tooltip>
        </Flex>
      </Group>
      <Accordion
        variant="contained"
        multiple={false}
        styles={(theme) => ({
          content: {
            padding: 0,
          },
          item: {
            overflow: 'hidden',
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
            boxShadow: theme.shadows.sm,
          },
          control: {
            padding: theme.spacing.sm,
          },
        })}
        className={classes.control}
      >
        <Accordion.Item value="details">
          <Accordion.Control icon={<IconFile size={20} />}>Files</Accordion.Control>
          <Accordion.Panel styles={{ card: { background: 'var(--color-secondary-bg)' } }}>
            <SimpleGrid cols={1} spacing={2}>
              {attachments.length > 0 &&
                attachments.map((attachment, index) => (
                  <div key={index}>
                    <LoginRedirect reason="add-to-collection">
                      <div>
                        <AttachmentCard {...attachment} parentMethod={parentMethod} />
                      </div>
                    </LoginRedirect>
                  </div>
                ))}
            </SimpleGrid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <RewardButton userId={bounty?.userId} type={'dataset'} id={bounty?.id} onCallBack={getResult}>
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
        >
          Reward
        </Button>
      </RewardButton>

      {bounty?.userId && <OtherUserCard userId={bounty?.userId} link={'dataSet'} />}
    </Stack>
  );
};

const useStyles = createStyles((theme) => ({
  titleWrapper: {
    gap: theme.spacing.xs,

    [containerQuery.smallerThan('md')]: {
      gap: theme.spacing.xs * 0.4,
      alignItems: 'flex-start',
    },
  },

  title: {
    wordBreak: 'break-word',
    [containerQuery.smallerThan('md')]: {
      fontSize: theme.fontSizes.xs * 2.4, // 24px
      width: '100%',
      paddingBottom: 0,
    },
  },
  control: {
    '& .mantine-Accordion-item[data-active]': {
      backgroundColor: 'var(--color-secondary-bg)',
    },
    '& .mantine-Accordion-item': {
      backgroundColor: 'var(--color-secondary-bg)',
      borderRadius: '8px',
    },
    '& .mantine-Accordion-panel .mantine-Paper-root': {
      backgroundColor: 'transparent',
    },
  },
}));

setPageOptions(BountyDetailsPage, {
  innerLayout: ({ children }: { children: React.ReactNode }) => (
    <ImageViewer>
      <ScrollAreaMain>{children}</ScrollAreaMain>
    </ImageViewer>
  ),
});
