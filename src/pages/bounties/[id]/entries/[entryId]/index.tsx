import React, { useEffect, useState } from 'react';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { InferGetServerSidePropsType } from 'next';
import {
  Button,
  Card,
  CloseButton,
  createStyles,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Image,
  Avatar,
  MantineProvider,
  Tooltip,
} from '@mantine/core';
import { NavigateBack } from '~/components/BackButton/BackButton';
import { useAspectRatioFit } from '~/hooks/useAspectRatioFit';
import { IconFolder, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { RenderHtml } from '~/components/RenderHtml/RenderHtml';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { ContentClamp } from '~/components/ContentClamp/ContentClamp';
import { Carousel } from '@mantine/carousel';
import { workDetail, workDownload } from '~/request/api/bounty';
import { DaysFromNow } from '~/components/Dates/DaysFromNow';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { formatBytes, abbreviateNumber } from '~/utils/number-helpers';
import { showErrorNotification } from '~/utils/notifications';
import { followAdd, followRemove } from '~/request/api/user/index';
import { triggerRoutedDialog } from '~/components/Dialog/RoutedDialogProvider';
import { ShareButton } from '~/components/ShareButton/ShareButton';
import { CommentSection } from '~/components/CommentSection/CommentSection';
import { CommentProvider } from '~/components/CommentSection/CommentProvider';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import XButton from '~/omnimuse-lib/components/XButton';
import { AppHeader } from '~/components/AppLayout/AppHeader';
import { useUserStore } from '~/store/user.store';
import RewardButton from '~/components/RewardButton/RewardButton';
import { useModelStore } from '~/store/model.store';
export const getServerSideProps = createServerSideProps({
  useSSG: true,
  useSession: true,
  resolver: async ({ ctx }) => {
    const { entryId } = ctx.query;
    return { props: { entryId } };
  },
});

const useStyles = createStyles((theme, _props, getRef) => {
  const isMobile = containerQuery.smallerThan('md');
  const isDesktop = containerQuery.largerThan('md');
  return {
    root: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      [isMobile]: {
        overflow: 'scroll',
      },
    },
    header: {
      '& .mantine-Header-root': {
        padding: '40px 0',
      },
    },
    carousel: {
      flex: 3,
      alignItems: 'stretch',
      background: 'transparent',
    },
    active: { ref: getRef('active') },
    imageLoading: {
      opacity: '50%',
    },
    sidebar: {
      width: '460px',
      borderRadius: 0,
      borderLeft: `1px solid ${theme.colors.dark[4]}`,
      display: 'flex',
      flexDirection: 'column',

      [isMobile]: {
        position: 'absolute',
        overflow: 'auto',
        top: '100%',
        left: 0,
        width: '100%',
        height: '100%',
        transition: '.3s ease transform',
        zIndex: 20,

        [`&.${getRef('active')}`]: {
          transform: 'translateY(-100%)',
        },
      },
    },
    mobileOnly: { [isDesktop]: { display: 'none' } },
    desktopOnly: { [isMobile]: { display: 'none' } },
    info: {
      position: 'absolute',
      bottom: theme.spacing.md,
      right: theme.spacing.md,
    },
    // Overwrite scrollArea generated styles
    scrollViewport: {
      '& > div': {
        minHeight: '100%',
        display: 'flex !important',
      },
    },
  };
});

const useCarrouselStyles = createStyles((theme, _props, getRef) => {
  return {
    root: {
      position: 'relative',
    },
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      zIndex: 1,
    },
    imageLoading: {
      pointerEvents: 'none',
      opacity: 0.5,
    },
    center: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    prev: { ref: getRef('prev') },
    next: { ref: getRef('next') },
    control: {
      position: 'absolute',
      // top: 0,
      // bottom: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,

      svg: {
        height: 50,
        width: 50,
      },

      [`&.${getRef('prev')}`]: {
        left: 0,
      },
      [`&.${getRef('next')}`]: {
        right: 0,
      },

      '&:hover': {
        color: theme.colors.blue[3],
      },
    },

    indicator: {
      pointerEvents: 'all',
      width: 25,
      height: 5,
      borderRadius: 10000,
      backgroundColor: theme.white,
      boxShadow: theme.shadows.sm,
      opacity: 0.6,
      transition: `opacity 150ms ${theme.transitionTimingFunction}`,

      '&[data-active]': {
        opacity: 1,
      },
    },
  };
});

export default function BountyEntryDetailsPage({
  entryId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { classes } = useStyles();
  const currentUser = useUserStore((state) => state.userInfo);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reslutData, setReslutData] = useState<any>({});
  const [opened, setopen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [rewardCount, setRewardCount] = useState(0);
  const refreshModelTotalCountKey = useModelStore((state) => state.refreshModelTotalCountKey);
  useEffect(() => {
    getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshModelTotalCountKey]);
  useEffect(() => {
    getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDetail = async () => {
    const res = await workDetail({ id: entryId + '' });
    // console.log(res);
    if (res?.code === 200) {
      // console.log(res.result)
      setReslutData(res.result);
      setRewardCount(res.result.bountyWork?.rewardCount);
    }
  };

  const clickWorkDownload2 = () => {
    if (reslutData?.bountyWork.status == 1) {
      return false;
    }
    getFilesList();
  };

  const clickWorkDownload = () => {
    if (reslutData.bountyWork.status === 1) {
      return false;
    }
    if (
      currentUser?.id == reslutData?.bountyBenefactor?.user_id &&
      reslutData.bountyWork.status === 1
    ) {
      // 采纳状态, 1:新作品, 2:已采纳
      showErrorNotification({
        title: 'hint',
        error: new Error('You have not paid points and cannot download'),
      });
      return false;
    }
    getFilesList();
  };

  // 下载参赛作品
  const getFilesList = async () => {
    const res = await workDownload({ id: entryId });
    console.log(res.result);
    if (res.code === 200) {
      setopen(true);
      setFileUrl(res.result[0].url);
    }
  };

  const handleConfirm = () => {
    window.open(fileUrl, '_black');
  };

  const handleFollowed = async () => {
    const res = reslutData?.bountyWork?.userInfo?.isFollow
      ? await followRemove(reslutData.bountyWork.userId)
      : await followAdd(reslutData.bountyWork.userId);
    if (res.code === 200) {
      setReslutData({
        ...reslutData,
        bountyWork: {
          ...reslutData.bountyWork,
          userInfo: {
            ...reslutData.bountyWork.userInfo,
            isFollow: !reslutData?.bountyWork?.userInfo?.isFollow,
          },
        },
      });
    } else {
      showErrorNotification({
        title: 'hint',
        error: new Error(res.message),
      });
    }
  };

  const getRewardResult = (count: number) => {
    setRewardCount(count);
  };

  const awardSection = (
    <>
      <Group spacing={0} position="apart" noWrap className="px-[20px] py-[20px] pb-[0px]">
        <div className="flex justify-start items-center ">
          <div>
            <Avatar src={reslutData?.bountyWork?.userInfo.image ?? ''} radius={'xl'} size={40} />
          </div>
          <div className="ml-2">
            <div className="text-[#FFF] overflow-hidden whitespace-nowrap overflow-ellipsis w-[200px]">
              {reslutData?.bountyWork?.userInfo.username}
            </div>
            <Text size="xs" color="dimmed">
              Joined <DaysFromNow date={reslutData?.bountyWork?.createdAt} />
            </Text>
          </div>
        </div>
        <div className="px-[20px]">
          <Button
            variant="outline"
            style={{
              border: '1px solid #2B2D30',
              borderRadius: '8px',
              background: 'rgba(43, 45, 48, 0.50)',
            }}
            onClick={handleFollowed}
          >
            {reslutData?.bountyWork?.userInfo.isFollow ? 'UnFollow' : 'Follow'}
          </Button>
        </div>
      </Group>
    </>
  );

  const shareSection = (
    <div>
      <div className="flex justify-between items-center px-[20px] pb-[16px]">
        {currentUser?.id === reslutData?.bountyBenefactor?.user_id &&
          reslutData?.bountyWork?.status == 1 && (
            <div className="flex-1 mr-[16px]">
              <div className="w-full">
                <Button
                  styles={{
                    root: {
                      height: '44px',
                    },
                  }}
                  fullWidth
                  leftIcon={
                    currentUser?.id !== reslutData?.bountyBenefactor?.user_id ? (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <Image src="/images/icon/stop.svg" width={22} height={22} />
                    ) : (
                      ''
                    )
                  }
                  variant="gradient"
                  gradient={{ from: '#9A5DFF', to: '#7760FF' }}
                  onClick={() => {
                    triggerRoutedDialog({
                      name: 'payConfirm',
                      state: {
                        type: 'payment',
                        contentId: entryId,
                        creditCount: reslutData?.bountyBenefactor?.unit_amount,
                      },
                    });
                  }}
                >
                  Payment
                </Button>
              </div>
            </div>
          )}

        <div className="flex-1">
          <RewardButton type={'bounty_work'} id={entryId} onCallBack={getRewardResult}>
            <Button
              styles={{
                root: {
                  height: '44px',
                  background:
                    currentUser?.id == reslutData?.bountyBenefactor?.user_id
                      ? 'var(--color-secondary-bg)'
                      : '',
                  border:
                    currentUser?.id == reslutData?.bountyBenefactor?.user_id
                      ? '1px solid #9A5DFF'
                      : '',
                  color: currentUser?.id == reslutData?.bountyBenefactor?.user_id ? '#9A5DFF' : '',
                },
              }}
              fullWidth
              leftIcon={
                currentUser?.id != reslutData?.bountyBenefactor?.user_id ? (
                  <Image src="/images/icon/stop.svg" width={22} height={22} alt="" />
                ) : (
                  ''
                )
              }
              variant={
                currentUser?.id != reslutData?.bountyBenefactor?.user_id ? 'gradient' : 'outline'
              }
              gradient={
                currentUser?.id != reslutData?.bountyBenefactor?.user_id
                  ? { from: '#9A5DFF', to: '#7760FF' }
                  : ''
              }
            >
              Reward
            </Button>
          </RewardButton>
        </div>
      </div>

      <Divider label="" labelPosition="center" />
    </div>
  );

  const notesSection = (
    <div>
      <div className="px-[20px] pb-[20px]">
        <div className="text-[#FFF] text-[16px] mb-[16px] ">Notes</div>
        <div className="bg-[var(--color-secondary-bg)] px-[16px] py-[14px] border-[1px] border-[#2B2D30] rounded-md">
          {reslutData?.bountyWork?.description ? (
            <ContentClamp maxHeight={116}>
              <RenderHtml html={reslutData?.bountyWork?.description} />
            </ContentClamp>
          ) : (
            'No Data'
          )}
        </div>
      </div>
      <Divider label="" labelPosition="center" />
    </div>
  );

  const filesSection = (
    <div>
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
      <div className="p-[20px] pt-[0px]">
        <div className="flex justify-between items-center mb-[16px]">
          <div className="text-[16px] text-[#FFF]">Files</div>
          <div>
            {currentUser?.id == reslutData?.bountyBenefactor?.user_id &&
              (reslutData?.bountyWork?.status == 1 ? (
                <Button
                  leftIcon={
                    <Image src="/images/icon/download2.svg" width={22} height={22} alt={''} />
                  }
                  variant="outline"
                  size="xs"
                  styles={{
                    root: {
                      borderRadius: '8px',
                      border: '1px solid #9A5DFF',
                      padding: '6px 10px',
                      background: 'transparent',
                      color: '#9A5DFF',
                      opacity: '0.6',
                    },
                  }}
                >
                  Download
                </Button>
              ) : (
                <Button
                  leftIcon={
                    <Image src="/images/icon/download2.svg" width={22} height={22} alt={''} />
                  }
                  variant="outline"
                  onClick={clickWorkDownload2}
                  size="xs"
                  styles={{
                    root: {
                      borderRadius: '8px',
                      border: '1px solid #9A5DFF',
                      padding: '6px 10px',
                      background: 'transparent',
                      color: '#9A5DFF',
                    },
                  }}
                >
                  Download
                </Button>
              ))}
          </div>
        </div>
        <div className="w-full p-[20px] rounded-md border-[1px] border-[#2B2D30] bg-[var(--color-secondary-bg)] ">
          {reslutData?.bountyWork?.workFileList?.map((item: any, index: number) => {
            return (
              <div key={index} className="cursor-pointer" onClick={clickWorkDownload}>
                <div className="flex justify-start items-center mb-[22px]  last:mb-[0px]">
                  <div className="mr-[14px]">
                    <IconFolder size={32} />
                  </div>
                  <div>
                    <div className="text-[14px] text-[#FFF] w-[250px] overflow-hidden whitespace-nowrap overflow-ellipsis ">
                      {item.filename}
                    </div>
                    <div className="text-[#9B9C9E] text-[12px]">
                      {formatBytes(item.fileSize, 0)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Divider label="" labelPosition="center" />
    </div>
  );

  return (
    <>
      <div className={classes.header}>
        <AppHeader fixed={false} />
      </div>
      <Paper className={classes.root}>
        <NavigateBack>
          {({ onClick }) => (
            <CloseButton
              style={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}
              size="lg"
              variant="default"
              onClick={onClick}
              className={classes.mobileOnly}
            />
          )}
        </NavigateBack>
        <BountyEntryCarousel
          imageList={reslutData?.bountyWork?.imageList || []}
          className={classes.carousel}
        />

        <Card className={classes.sidebar} p={0} style={{ background: '#000' }}>
          <Stack className="overflow-y-auto" spacing={1}>
            <Card.Section style={{ overflowY: 'auto' }}>
              <Stack spacing={20}>
                {awardSection}
                {shareSection}
                {notesSection}
                {filesSection}
                <div className="p-[20px] pt-[0px] text-[16px] text-[#FFF] ">
                  <div className="mb-[16px] flex justify-between">
                    <div className="text-[16px]">Discussion</div>
                  </div>
                  <div className="flex justify-start items-center mb-[17px]">
                    <div className="inline-flex justify-start items-center">
                      <div className="mr-[5px]">
                        <Image src="/images/icon/gold.svg" width={14} height={14} alt="" />
                      </div>
                      <div className="text-[12px] text-[#FFF]">{abbreviateNumber(rewardCount)}</div>
                    </div>
                  </div>
                  <div>
                    {entryId && (
                      <CommentProvider modelId={entryId} type={5}>
                        <CommentSection />
                      </CommentProvider>
                    )}
                  </div>
                </div>
              </Stack>
            </Card.Section>
          </Stack>
        </Card>
      </Paper>
    </>
  );
}

export function BountyEntryCarousel({
  imageList,
  className,
}: {
  imageList: Array[T];
  className: string;
}) {
  imageList;
  const { classes, cx } = useCarrouselStyles();
  const router = useRouter();

  const { setRef } = useAspectRatioFit({
    height: 1200,
    width: 1200,
  });

  return (
    <div ref={setRef} className={cx(classes.root, className)}>
      <Carousel
        mx="auto"
        align="center"
        withControls
        withIndicators={imageList.length > 1 ? true : false}
        controlSize={56}
        slideGap="xs"
        controlsOffset="xs"
        styles={{
          root: {
            padding: '0 16px',
            height: '100%',
          },
          indicator: {
            width: '40px',
            '&[data-active]': {
              background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
            },
          },
          control: {
            background: 'rgba(0, 0, 0, 0.6)',
            border: 'none',
            color: '#FFF',
            svg: {
              width: '30px',
              height: '30px',
            },
            '&[data-inactive]': {
              opacity: 0,
              cursor: 'default',
            },
          },
          viewport: {
            height: '100%',
          },
          container: {
            height: '100%',
          },
        }}
      >
        {imageList.length > 0 &&
          imageList.map((item: any, index: number) => (
            <Carousel.Slide key={index}>
              <div className="flex justify-center items-center my-0 mx-auto h-[100%]">
                <EdgeMedia className="m-auto" src={item} cid={item} width={576} loading="lazy" />
              </div>
            </Carousel.Slide>
          ))}
      </Carousel>
      <Tooltip label="close" position="top">
        <div
          onClick={() => {
            router.back();
          }}
          className="flex justify-center items-center absolute right-[20px] top-[19px] bg-[rgba(43, 45, 48, 0.50)] size-[32px] rounded-md text-center cursor-pointer border-[#2B2D30] border"
        >
          <IconX size={16} />
        </div>
      </Tooltip>
      <Tooltip label="Share" position="top">
        <ShareButton url={router.asPath}>
          <div className="flex justify-center items-center absolute right-[20px] top-[62px] bg-[rgba(43, 45, 48, 0.50)] size-[32px] rounded-md text-center cursor-pointer border-[#2B2D30] border">
            <Image src="/images/icon/share.svg" width={16} height={16} alt="" />
          </div>
        </ShareButton>
      </Tooltip>
    </div>
  );
}

BountyEntryDetailsPage.getLayout = (page: React.ReactElement) => (
  <MantineProvider theme={{ colorScheme: 'dark' }} inherit>
    {page}
  </MantineProvider>
);
