import { createStyles, UnstyledButton, Center, Group, ActionIcon, Stack } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { CollectionType } from '~/types/prisma/schema';
import {
  IconShare3,
  IconX,
  IconHeart,
  IconHeartFilled,
  IconStar,
  IconStarFilled,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { truncate } from 'lodash-es';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { useImageDetailContext } from '~/components/Image/Detail/ImageDetailProvider';
import { ImageGuard2 } from '~/components/ImageGuard/ImageGuard2';
import { ShareButton } from '~/components/ShareButton/ShareButton';
import { useAspectRatioFit } from '~/hooks/useAspectRatioFit';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';
import { constants } from '~/server/common/constants';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { NotFound } from '~/components/AppLayout/NotFound';

type GalleryCarouselProps = {
  className?: string;
};

/**NOTES**
  - when our current image is not found in the images array, we can navigate away from it, but we can't use the arrows to navigate back to it.
*/
const maxIndicators = 20;
export function ImageDetailCarousel({ className }: GalleryCarouselProps) {
  const { classes, cx, theme } = useStyles();
  const {
    images,
    image: image,
    likeData,
    next,
    previous,
    navigate,
    canNavigate,
    connect,
    close,
    shareUrl,
    toggleInfo,
    handleLike,
    handleCollect,
  } = useImageDetailContext() as any;

  const { setRef, height, width } = useAspectRatioFit({
    height: image?.height ?? 1200,
    width: image?.width ?? 1200,
  });

  const flags = useFeatureFlags();

  // const handleReportClick = (imageId: number) =>
  //   openContext('report', { entityType: ReportEntity.Image, entityId: imageId }, { zIndex: 1000 });

  // #region [navigation]
  useHotkeys([
    ['ArrowLeft', previous],
    ['ArrowRight', next],
  ]);
  // #endregion

  if (!image) return <NotFound />;

  const indicators = images.map(({ id }) => (
    <UnstyledButton
      key={id}
      data-active={image.id === id || undefined}
      className={classes.indicator}
      aria-hidden
      tabIndex={-1}
      onClick={() => navigate(id)}
    />
  ));

  const hasMultipleImages = images.length > 1;

  return (
    <div ref={setRef} className={cx(classes.root, className)}>
      {canNavigate && (
        <>
          <UnstyledButton className={cx(classes.control, classes.prev)} onClick={previous}>
            <ActionIcon
              size={60}
              radius="xl"
              color="primary.2"
              variant="filled"
              className={classes.actionIcon}
            >
              <IconChevronLeft />
            </ActionIcon>
          </UnstyledButton>

          <UnstyledButton className={cx(classes.control, classes.next)} onClick={next}>
            <ActionIcon
              size={60}
              radius="xl"
              color="primary.2"
              variant="filled"
              className={classes.actionIcon}
            >
              <IconChevronRight />
            </ActionIcon>
          </UnstyledButton>
        </>
      )}
      <ImageGuard2 image={image} {...connect}>
        {(safe) => (
          <>
            <Group
              position="apart"
              spacing="sm"
              px={8}
              style={{ position: 'absolute', top: 15, width: '100%', zIndex: 10 }}
            >
              <Group>
                <ImageGuard2.BlurToggle
                  radius="xl"
                  h={30}
                  size="lg"
                  sfwClassName={classes.actionIcon}
                />
                {/* <Badge
                  radius="xl"
                  size="sm"
                  color="#020e1a"
                  px="xs"
                  variant="light"
                  className={classes.actionIcon}
                >
                  <Group spacing={4}>
                    <IconEye size={18} stroke={2} color="white" />
                    <Text color="white" size="xs" align="center" weight={500}>
                      {abbreviateNumber(image.stats?.viewCountAllTime ?? 0)}
                    </Text>
                  </Group>
                </Badge> */}
              </Group>
              <Stack spacing="xs">
                <ActionIcon
                  size={40}
                  radius="xl"
                  color="primary.2"
                  variant="filled"
                  className={classes.actionIcon}
                  onClick={close}
                >
                  <IconX size={18} strokeWidth={2} color="white" />
                </ActionIcon>
                <ActionIcon
                  size={40}
                  radius="xl"
                  color="primary.2"
                  variant="filled"
                  className={classes.actionIcon}
                  onClick={() => handleLike()}
                >
                  {likeData.likestatus ? (
                    <IconHeartFilled className="text-[#FF498A]" size={18} strokeWidth={2} />
                  ) : (
                    <IconHeart className="text-[#fff]" size={18} strokeWidth={2} />
                  )}
                </ActionIcon>
                <ActionIcon
                  size={40}
                  radius="xl"
                  color="primary.2"
                  variant="filled"
                  className={classes.actionIcon}
                  onClick={() => handleCollect()}
                >
                  {likeData.collectstatus ? (
                    <IconStarFilled className="text-[#FFA223]" size={18} strokeWidth={2} />
                  ) : (
                    <IconStar className="text-[#fff]" size={18} strokeWidth={2} />
                  )}
                </ActionIcon>
                <ShareButton
                  url={shareUrl}
                  title={`Image by ${image?.user?.username}`}
                  collect={{ type: CollectionType.Image, imageId: image.id }}
                >
                  <ActionIcon
                    size={40}
                    radius="xl"
                    color="primary.2"
                    variant="filled"
                    className={classes.actionIcon}
                  >
                    <IconShare3 size={18} strokeWidth={2} color="white" />
                  </ActionIcon>
                </ShareButton>
              </Stack>
            </Group>
            <Stack
              px={8}
              style={{
                position: 'absolute',
                bottom: hasMultipleImages ? theme.spacing.xl + 12 : 15,
                width: '100%',
                zIndex: 10,
              }}
            >
              <Group spacing={4} noWrap position="apart">
                {/* 表情评论控件 */}
                {/* <Reactions
                  entityId={image.id}
                  entityType="image"
                  reactions={image.reactions}
                  metrics={{
                    likeCount: image.reactions?.like,
                    dislikeCount: image.reactions?.dislike,
                    heartCount: image.reactions?.heart,
                    laughCount: image.reactions?.laugh,
                    cryCount: image.reactions?.cry,
                    tippedAmountCount: 0,
                  }}
                  targetUserId={image?.user?.id}
                />

                <ActionIcon
                  size={30}
                  onClick={toggleInfo}
                  radius="xl"
                  color="gray.8"
                  variant="light"
                  className={classes.actionIcon}
                >
                  <IconInfoCircle size={20} color="white" />
                </ActionIcon> */}
              </Group>
            </Stack>
            <Center
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, rgb(48 14 106 / 42%) 0%, rgb(32 24 78 / 46%) 100%)',
              }}
            >
              <Center
                style={{
                  position: 'relative',
                  height: height,
                  width: width,
                }}
              >
                {/* {!safe ? (
                  <MediaHash {...image} />
                ) : ( */}
                <EdgeMedia
                  src={image.url}
                  cid={image.url}
                  name={image.name ?? (image.id && image.id.toString())}
                  alt={
                    image.meta
                      ? truncate(image.meta.prompt, { length: constants.altTruncateLength })
                      : image.name ?? undefined
                  }
                  type="image"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                  width="original"
                  anim
                  controls
                  fadeIn
                />
                {/* )} */}
              </Center>
            </Center>
          </>
        )}
      </ImageGuard2>

      {images.length <= maxIndicators && hasMultipleImages && (
        <div className={classes.indicators}>{indicators}</div>
      )}
    </div>
  );
}

const useStyles = createStyles((theme, _props, getRef) => {
  const isMobile = containerQuery.smallerThan('sm');
  const isDesktop = containerQuery.largerThan('sm');

  return {
    mobileOnly: { [isDesktop]: { display: 'none' } },
    desktopOnly: { [isMobile]: { display: 'none' } },
    root: {
      position: 'relative',
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
        height: 30,
        width: 30,
      },

      [`&.${getRef('prev')}`]: {
        left: '10px',
      },
      [`&.${getRef('next')}`]: {
        right: '10px',
      },

      '&:hover': {
        color: theme.colors.blue[3],
      },
    },
    indicators: {
      position: 'absolute',
      bottom: theme.spacing.md,
      top: undefined,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      pointerEvents: 'none',
    },

    indicator: {
      pointerEvents: 'all',
      width: 40,
      height: 5,
      borderRadius: 10000,
      // backgroundColor: theme.white,
      backgroundColor: '#525760',
      boxShadow: theme.shadows.sm,
      opacity: 0.3,
      transition: `opacity 150ms ${theme.transitionTimingFunction}`,

      '&[data-active]': {
        opacity: 1,
        background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
      },
    },

    generateButton: {
      position: 'relative',
      background: theme.fn.rgba(theme.colors.primary[6], 0.6),
      border: '1px solid rgba(255,255,255,0.5)',

      '&:hover': {
        background: theme.fn.rgba(theme.colors.primary[3], 0.8),
        transform: 'none',

        '.glow': {
          transform: 'scale(1.1, 1.15)',
        },
      },

      '&:active': {
        background: theme.fn.rgba(theme.colors.primary[3], 0.8),
        transform: 'none',
      },

      '.glow': {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        background: theme.fn.linearGradient(
          10,
          theme.colors.primary[6],
          theme.colors.primary[4],
          theme.colors.primary[2],
          theme.colors.cyan[9],
          theme.colors.cyan[7],
          theme.colors.cyan[5]
        ),
        backgroundSize: '300%',
        borderRadius: theme.radius.xl,
        filter: 'blur(4px)',
        zIndex: -1,
        animation: 'glowing 3.5s linear infinite',
        transform: 'scale(1.05, 1.1)',
        transition: 'transform 300ms linear',
      },
    },
    actionIcon: {
      height: 30,
      // backdropFilter: 'blur(7px)',
      color: 'white',
      // background: theme.colors.gray[9],
      background: 'rgba(43,45,48,0.5)',
      //  theme.fn.rgba(theme.colors.gray[10]),
    },
    badge: {
      userSelect: 'none',
      height: 'auto',
      padding: '8px 8px',
      border: '2px #2B2D30 solid',
      background: 'rgba(35, 37, 41, 1)',
    },
  };
});
