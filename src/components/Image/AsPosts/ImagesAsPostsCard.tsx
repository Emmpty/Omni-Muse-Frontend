import { Carousel, Embla } from '@mantine/carousel';
import { ActionIcon, Group, Paper, Tooltip, createStyles, Stack, Image } from '@mantine/core';
import HoverActionButton from '~/components/Cards/components/HoverActionButton';
import { IconExclamationMark, IconBrush, IconShare3 } from '@tabler/icons-react';
import { truncate } from 'lodash-es';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DaysFromNow } from '~/components/Dates/DaysFromNow';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { OnsiteIndicator } from '~/components/Image/Indicators/OnsiteIndicator';
import { MasonryCard } from '~/components/MasonryGrid/MasonryCard';
import { ShareButton } from '~/components/ShareButton/ShareButton';
import { UserAvatar } from '~/components/UserAvatar/UserAvatar';
import { useInView } from '~/hooks/useInView';
import { constants } from '~/server/common/constants';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';
import { ImageGuard2 } from '~/components/ImageGuard/ImageGuard2';
import { useGenerationnnnnStore } from '~/store/generationnnnn.store';
import { useRouter } from 'next/router';
import ReactionPicker from '~/omnimuse-lib/features/common/ReactionPicker/ReactionPicker';
import { abbreviateNumber } from '~/utils/number-helpers';
// 页面-画廊单个图片组件
export function ImagesAsPostsCard({
  data,
  width: cardWidth,
  height,
}: {
  data: any;
  width: number;
  height: number;
}) {
  const { ref, inView } = useInView({ rootMargin: '200%' });
  const { classes } = useStyles();
  const { open, setImageId } = useGenerationnnnnStore();
  const modelVersionName = '';
  const postId = data.postId ?? undefined;
  const router = useRouter();
  const image = data.images[0];
  const carouselHeight = height - 6;
  const cardHeight = height + 79;
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  useEffect(() => {
    if (!embla) return;
    setSlidesInView(embla.slidesInView(true));
    const onSelect = () => setSlidesInView([...embla.slidesInView(true), ...embla.slidesInView()]);
    embla.on('select', onSelect);
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  const imageIdsString = data.images.map((x) => x.id).join('_');
  const carouselKey = useMemo(() => `${imageIdsString}_${cardWidth}`, [imageIdsString, cardWidth]);

  const handleDraw = (e: any, id: any) => {
    e.stopPropagation();
    e.preventDefault();
    open();
    setImageId(id);
  };

  return (
    <MasonryCard
      withBorder
      shadow="sm"
      p={0}
      height={cardHeight}
      ref={ref}
      className={classes.card}
    >
      <Paper p="xs" radius={8} className={classes.header}>
        {inView && (
          <Group position="apart" noWrap className="w-full">
            <UserAvatar
              user={data.user}
              subText={
                <>
                  {data.publishedAt ? <DaysFromNow date={data.publishedAt} /> : 'Not published'}
                  {modelVersionName ?? 'Cross-post'}
                </>
              }
              subTextForce
              size="md"
              spacing="xs"
              withUsername
              linkToProfile
            />
            <Group ml="auto" noWrap>
              {!data.publishedAt && (
                <Tooltip label="Post not Published" withArrow>
                  <Link href={`/posts/${data.postId}/edit`}>
                    <ActionIcon color="red" variant="outline">
                      <IconExclamationMark />
                    </ActionIcon>
                  </Link>
                </Tooltip>
              )}
              {/* 点赞icon */}
              <div
                className="size-[34px] rounded-md cursor-pointer flex items-center justify-center bg-[rgba(43,45,48,0.5)] hover:bg-[rgba(43,45,48)] "
                style={{
                  color: 'unset',
                  border: '1px #2B2D30 solid',
                }}
              >
                <LoginRedirect reason="report-content">
                  <ShareButton url={`/images/${image.id}`} title={data?.user?.username ?? ''}>
                    <div className="w-full h-full flex items-center justify-center">
                      <IconShare3 color="White" size={18} strokeWidth={1.5} />
                    </div>
                  </ShareButton>
                </LoginRedirect>
              </div>
            </Group>
          </Group>
        )}
      </Paper>
      <div className={classes.container}>
        <div className={classes.content} style={{ opacity: inView ? 1 : 0 }}>
          {inView && (
            <>
              {data.images.length === 1 ? (
                <ImageGuard2 image={image}>
                  {(safe) => (
                    <div className={classes.imageContainer}>
                      {image.meta && 'civitaiResources' in (image.meta as object) && (
                        <OnsiteIndicator />
                      )}
                      <ImageGuard2.BlurToggle className="absolute top-2 left-2 z-10" />
                      {safe && (
                        <Stack spacing="xs" className="absolute top-2 right-2 z-10">
                          {/* 画同款 */}
                          {
                            <HoverActionButton
                              label="Remix"
                              size={40}
                              color="opacity"
                              variant="filled"
                              data-activity="remix:model-gallery"
                              onClick={(e) => handleDraw(e, image.id)}
                            >
                              <IconBrush stroke={1.5} size={20} />
                            </HoverActionButton>
                          }
                        </Stack>
                      )}
                      <div
                        onClick={() => router.push('/images/' + image.id)}
                        className="cursor-pointer"
                      >
                        <>
                          {safe && (
                            <EdgeMedia
                              src={image.url}
                              cid={image.url}
                              name={image.name ?? image.id.toString()}
                              alt={
                                image.meta
                                  ? truncate(image.meta.prompt, {
                                      length: constants.altTruncateLength,
                                    })
                                  : image.name ?? undefined
                              }
                              type={image.type}
                              width={450}
                              placeholder="empty"
                              className={classes.image}
                              wrapperProps={{ style: { zIndex: 1 } }}
                              fadeIn
                            />
                          )}
                        </>
                      </div>
                      {/* 表情评论 */}

                      <div className="flex justify-start items-center absolute bottom-[14px] left-[14px] z-20">
                        <div className="mr-[10px]">
                          <ReactionPicker
                            contentId={image.id}
                            expressionType={2}
                            reactions={image.reactions}
                          />
                        </div>
                        <div className="inline-flex justify-start items-center rounded-[16px] bg-[var(--color-secondary-bg)] px-[8px]">
                          <div>
                            <Image src="/images/icon/gold.svg" width={14} height={14} alt="" />
                          </div>
                          <div className="text-[12px] text-[#FFF] ml-[4px]">
                            {abbreviateNumber(data.rewardCount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </ImageGuard2>
              ) : (
                <Carousel
                  key={carouselKey}
                  withControls
                  draggable
                  loop
                  style={{ flex: 1 }}
                  withIndicators
                  controlSize={32}
                  height={carouselHeight}
                  getEmblaApi={setEmbla}
                  classNames={{
                    control: classes.carouselControl,
                    indicator: classes.carouselIndicator,
                    indicators: classes.carouselIndicators,
                  }}
                >
                  {data.images.map((image: any, index: any) => (
                    <Carousel.Slide key={image.id}>
                      {slidesInView.includes(index) && (
                        <ImageGuard2 image={image} connectType="post" connectId={postId}>
                          {(safe) => (
                            <div className={classes.imageContainer}>
                              {image.meta && 'civitaiResources' in (image.meta as object) && (
                                <OnsiteIndicator />
                              )}
                              <ImageGuard2.BlurToggle className="absolute top-2 left-2 z-10" />
                              {safe && (
                                <Stack spacing="xs" className="absolute top-2 right-2 z-10">
                                  <HoverActionButton
                                    label="Remix"
                                    size={40}
                                    color="opacity"
                                    variant="filled"
                                    data-activity="remix:model-gallery"
                                    onClick={(e) => handleDraw(e, image.id)}
                                  >
                                    <IconBrush stroke={1.5} size={20} />
                                  </HoverActionButton>
                                </Stack>
                              )}
                              <div
                                className="cursor-pointer"
                                onClick={() => router.push(`/images/${image.id}?postId=${postId}`)}
                              >
                                <>
                                  {safe && (
                                    <EdgeMedia
                                      src={image.url}
                                      cid={image.url}
                                      name={image.name ?? image.id.toString()}
                                      alt={
                                        image.meta
                                          ? truncate(image.meta.prompt, {
                                              length: constants.altTruncateLength,
                                            })
                                          : image.name ?? undefined
                                      }
                                      type={image.type}
                                      width={450}
                                      placeholder="empty"
                                      className={classes.image}
                                      wrapperProps={{ style: { zIndex: 1 } }}
                                      fadeIn
                                    />
                                  )}
                                </>
                              </div>
                              {/* 表情评论 */}
                              <div className="flex justify-start items-center absolute bottom-[14px] left-[14px] z-20 ">
                                <div className="mr-[10px]">
                                  <ReactionPicker
                                    contentId={image.id}
                                    expressionType={2}
                                    reactions={image.reactions}
                                  />
                                </div>
                                <div className="inline-flex justify-start items-center rounded-[16px] bg-[var(--color-secondary-bg)] px-[8px]">
                                  <div>
                                    <Image
                                      src="/images/icon/gold.svg"
                                      width={14}
                                      height={14}
                                      alt=""
                                    />
                                  </div>
                                  <div className="text-[12px] text-[#FFF] ml-[4px]">
                                    {abbreviateNumber(data.rewardCount)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </ImageGuard2>
                      )}
                    </Carousel.Slide>
                  ))}
                </Carousel>
              )}
            </>
          )}
        </div>
      </div>
    </MasonryCard>
  );
}

const useStyles = createStyles((theme) => ({
  title: {
    lineHeight: 1.1,
    fontSize: 14,
    color: 'white',
    fontWeight: 500,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'auto !important',
    backgroundColor: 'rgba(43,45,48,0.5)',
  },
  header: {
    borderBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(43,45,48,0.5)',
  },
  link: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  slide: {
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topRight: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    zIndex: 10,
  },
  contentOverlay: {
    position: 'absolute',
    width: '100%',
    left: 0,
    zIndex: 10,
    padding: theme.spacing.sm,
  },
  top: { top: 0 },
  blurHash: {
    opacity: 0.7,
    zIndex: 1,
  },
  container: {
    position: 'relative',
    flex: 1,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: theme.other.fadeIn,
    opacity: 0,
    zIndex: 2,
  },
  info: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    zIndex: 1,
  },
  statBadge: {
    background: 'rgba(212,212,212,0.2)',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    zIndex: 1,
  },
  carouselControl: {
    color: 'white',
    border: 0,
    width: 40,
    height: 40,

    backgroundColor: 'rgba(0,0,0,0.8)',
    svg: {
      width: 18,
      height: 18,
    },
  },
  carouselIndicators: {
    bottom: -5,
    height: 5,
    zIndex: 5,
    display: 'flex',
    gap: '1px',
  },
  carouselIndicator: {
    width: 'auto',
    height: 8,
    flex: 1,
    transition: 'width 250ms ease',
    borderRadius: 0,
    backgroundColor: 'rgba(43, 45, 48,0.5)',
    boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)',
    [`&[data-active]`]: {
      background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
    },
  },
}));
