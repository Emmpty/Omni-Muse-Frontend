import {
  ActionIcon,
  Box,
  Button,
  Card,
  createStyles,
  Divider,
  Group,
  MantineProvider,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Image,
} from '@mantine/core';
import { Availability } from '~/types/prisma/schema';
import { IconArrowBackUp, IconX } from '@tabler/icons-react';
import { DaysFromNow } from '~/components/Dates/DaysFromNow';
import { FollowUserButton } from '~/components/FollowUserButton/FollowUserButton';
import { ImageDetailCarousel } from '~/components/Image/Detail/ImageDetailCarousel';
import { useImageDetailContext } from '~/components/Image/Detail/ImageDetailProvider';
import { ImageResources } from '~/components/Image/Detail/ImageResources';
import { ImageMeta } from '~/components/ImageMeta/ImageMeta';
import { Meta } from '~/components/Meta/Meta';
import { PageLoader } from '~/components/PageLoader/PageLoader';
import { ReactionSettingsProvider } from '~/components/Reaction/ReactionSettingsProvider';
import { UserAvatar } from '~/components/UserAvatar/UserAvatar';
import { env } from '~/env/client.mjs';
import { getIsSafeBrowsingLevel } from '~/shared/constants/browsingLevel.constants';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { ConfirmDialog } from '~/components/Dialog/Common/ConfirmDialog';
import { dialogStore } from '~/components/Dialog/dialogStore';
import { imageRemoved } from '~/request/api/generate';
import { showErrorNotification, showSuccessNotification } from '~/utils/notifications';
import { CommentSection } from '~/components/CommentSection/CommentSection';
import { CommentProvider } from '~/components/CommentSection/CommentProvider';
import ReactionPicker from '~/omnimuse-lib/features/common/ReactionPicker/ReactionPicker';
import { abbreviateNumber } from '~/utils/number-helpers';
import RewardButton from '~/components/RewardButton/RewardButton';
import { useState } from 'react';
// 页面-画廊详情
export function ImageDetail() {
  const { classes, cx, theme } = useStyles();
  const { image: image, isOwner, isLoading, active, close, toggleInfo } = useImageDetailContext();
  const [rewardCount, setRewardCount] = useState(image.rewardCount);
  if (isLoading) return <PageLoader />;
  // if (!image.id) return <NotFound />;
  const nsfw = !getIsSafeBrowsingLevel(image.nsfwLevel);
  const handRemoved = async () => {
    try {
      const { code, result } = await imageRemoved({ id: image.id });
      if (code == 200) {
        showSuccessNotification({ message: 'Successfully removed image' });
        close();
      }
    } catch (error: any) {
      console.error('error', error.message);
      showErrorNotification({
        title: 'Failed to removed image',
        error: new Error(error.message),
      });
    }
  };
  const getResult = (reward: number) => {
    setRewardCount(reward);
  };
  return (
    <>
      <Meta
        title={`Image posted by ${image?.user?.username}`}
        images={image}
        links={[{ href: `${env.NEXT_PUBLIC_BASE_URL}/images/${image.id}`, rel: 'canonical' }]}
        deIndex={nsfw || !!image.needsReview || image.availability === Availability.Unsearchable}
      />
      <MantineProvider theme={{ colorScheme: 'dark' }} inherit>
        <Paper
          className={cx(classes.root, {
            [classes.active]: active,
          })}
        >
          <div className={classes.carouselWrapper}>
            <ReactionSettingsProvider
              settings={{
                hideReactionCount: false,
                buttonStyling: (reaction, hasReacted) => ({
                  radius: 'xl',
                  variant: 'light',
                  px: undefined,
                  pl: 4,
                  pr: 8,
                  h: 30,
                  style: {
                    color: 'white',
                    background: hasReacted
                      ? theme.fn.rgba(theme.colors.blue[4], 0.4)
                      : theme.fn.rgba(theme.colors.gray[8], 0.4),
                    // backdropFilter: 'blur(7px)',
                  },
                }),
              }}
            >
              {/* 画廊详情-图片区域 */}
              <ImageDetailCarousel className={classes.carousel} />
            </ReactionSettingsProvider>
          </div>
          <Card className={cx(classes.sidebar)}>
            <Card.Section py="xs" inheritPadding>
              <Stack>
                <Group position="apart" spacing={8}>
                  <UserAvatar
                    user={image.user}
                    avatarProps={{ size: 32 }}
                    size="sm"
                    subText={
                      <Text size="xs" color="dimmed">
                        {image.publishedAt ? (
                          <>
                            Uploaded <DaysFromNow date={image.publishedAt} />
                          </>
                        ) : (
                          'Not published'
                        )}
                      </Text>
                    }
                    subTextForce
                    withUsername
                    linkToProfile
                  />
                  <Group spacing={8} noWrap>
                    <FollowUserButton userId={image?.user?.id} size="md" compact />
                    <ActionIcon
                      onClick={toggleInfo}
                      size="md"
                      radius="xl"
                      className={classes.mobileOnly}
                    >
                      <IconX size={20} />
                    </ActionIcon>
                  </Group>
                </Group>
                {isOwner && (
                  <Button
                    button-type="primary"
                    size="xl"
                    radius="xl"
                    color="gray"
                    compact
                    onClick={() => {
                      dialogStore.trigger({
                        component: ConfirmDialog,
                        props: {
                          title: 'Remove picture',
                          message: (
                            <Text size="sm" weight={500} sx={{ flex: 1 }}>
                              Are you sure you want to removed the picture?
                            </Text>
                          ),
                          onConfirm: async () => await handRemoved(),
                          labels: { cancel: 'Cancel', confirm: 'Confirm' },
                        },
                      });
                    }}
                  >
                    <Group spacing={4}>
                      <IconArrowBackUp size={18} stroke={2} />
                      <Text size="xs" className="leading-5">
                        Removed
                      </Text>
                    </Group>
                  </Button>
                )}
              </Stack>
              <RewardButton
                userId={image?.user?.id}
                type={'image'}
                id={image.id}
                onCallBack={getResult}
              >
                <div className="w-full pt-[20px] pb-[13px]">
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
                </div>
              </RewardButton>
            </Card.Section>
            <Card.Section
              component={ScrollArea}
              style={{ flex: 1, position: 'relative' }}
              classNames={{ viewport: classes.scrollViewport }}
            >
              <Stack spacing="md" pt={0} pb="md" style={{ flex: 1 }}>
                <div>
                  <Stack spacing={8}>
                    <Divider className="border-[#2D2D2D]" />
                    <Text size="md" ml="xs" mt="sm">
                      Discussion
                    </Text>

                    <div className="flex justify-start items-center">
                      <div className="mr-[18px]">
                        <ReactionPicker
                          className="my-2"
                          contentId={image.id}
                          expressionType={2}
                          reactions={image.reactions}
                        />
                      </div>
                      <div className="inline-flex justify-start items-center">
                        <div className="mr-[5px]">
                          <Image src="/images/icon/gold.svg" width={14} height={14} alt="" />
                        </div>
                        <div className="text-[12px] text-[#FFF]">
                          {abbreviateNumber(rewardCount)}
                        </div>
                      </div>
                    </div>

                    <Paper p="sm" radius={0} sx={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <CommentProvider modelId={image.id} type={2}>
                        <CommentSection />
                      </CommentProvider>
                    </Paper>
                  </Stack>
                </div>
                <Stack spacing="md">
                  <Stack spacing={8}>
                    <Divider className="border-[#2D2D2D]" />
                    <Text size="md" ml="xs" mt="sm">
                      Resources Used
                    </Text>
                  </Stack>
                  {image.meta && (
                    <>
                      <Box px="md">
                        {image?.meta.resources && (
                          <ImageResources
                            imageId={image.id}
                            resourcesProps={image?.meta.resources}
                          />
                        )}
                      </Box>
                      <Stack spacing={8}>
                        <Divider className="mt-[10px] border-[#2D2D2D]" />
                        <Text size="sm" ml="xs" mt="sm">
                          Generation Data
                        </Text>
                      </Stack>

                      <Box px="md">
                        <ImageMeta meta={image.meta} imageId={image.id} taskId={image.postId} />
                      </Box>
                    </>
                  )}
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Paper>
      </MantineProvider>
    </>
  );
}

const useStyles = createStyles((theme, _props, getRef) => {
  const isMobile = containerQuery.smallerThan('sm');
  const isDesktop = containerQuery.largerThan('sm');
  const sidebarWidth = 457;
  return {
    root: {
      flex: 1,
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 200,
      transition: '.3s ease padding-right',

      [`&.${getRef('active')}`]: {
        paddingRight: sidebarWidth,

        [isMobile]: {
          paddingRight: 0,
        },
      },
    },
    carouselWrapper: {
      flex: 1,
      alignItems: 'stretch',
      position: 'relative',
    },
    carousel: {
      width: '100%',
      height: '100%',
    },
    active: { ref: getRef('active') },
    sidebar: {
      width: sidebarWidth,
      borderRadius: 0,
      borderLeft: `1px solid ${theme.colors.dark[4]}`,
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      transition: '.3s ease transform',
      right: 0,
      transform: 'translateX(100%)',
      height: '100%',
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      [`.${getRef('active')} &`]: {
        transform: 'translateX(0)',
      },

      [isMobile]: {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        height: '100%',
        transform: 'translateY(100%)',
        zIndex: 20,

        [`.${getRef('active')} &`]: {
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
