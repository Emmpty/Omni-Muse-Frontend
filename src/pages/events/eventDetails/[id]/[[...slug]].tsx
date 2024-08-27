import {
  Button,
  Box,
  Container,
  createStyles,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { Carousel, Embla } from '@mantine/carousel';
import { IconShare3 } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { ContentClamp } from '~/components/ContentClamp/ContentClamp';
import { NotFound } from '~/components/AppLayout/NotFound';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { PageLoader } from '~/components/PageLoader/PageLoader';
import { RenderHtml } from '~/components/RenderHtml/RenderHtml';
import { ShareButton } from '~/components/ShareButton/ShareButton';
import { useContainerSmallerThan } from '~/components/ContainerProvider/useContainerSmallerThan';
import { CommentSection } from '~/components/CommentSection/CommentSection';
import { CommentProvider } from '~/components/CommentSection/CommentProvider';
import { formatDate } from '~/utils/date-helpers';
import { slugit } from '~/utils/string-helpers';
import { containerQuery } from '~/utils/mantine-css-helpers';
import XIconButton from '~/omnimuse-lib/components/XButton/XIconButton';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';
import { getEventsDetail as fetchEventsDetails } from '~/request/api/events';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, slug } = context.params || {}; // 从路径中获取 id 和 slug
  return {
    props: { id, slug: slug || null }, // 将 id 和 slug 作为 props 传递给页面组件
  };
};

export default function ArticleDetailsPage({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { classes } = useStyles();
  const mobile = useContainerSmallerThan('sm');
  const [isLoading, setIsLoading] = useState(false);
  const [eventsDetails, setEventsDetails] = useState({});
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);
  const discussionSectionRef = useRef<HTMLDivElement>(null);
  const { getIsOwner } = useUserInfo();

  useEffect(() => {
    if (!embla) return;
    setSlidesInView(embla.slidesInView(true));
    const onSelect = () => setSlidesInView([...embla.slidesInView(true), ...embla.slidesInView()]);
    embla.on('select', onSelect);
    return () => {
      embla.off('select', onSelect);
    };
  }, [embla]);

  const loadEventDetail = async () => {
    setIsLoading(true);
    try {
      const { code, result } = await fetchEventsDetails({ id });
      if (code === 200) {
        setEventsDetails(result.race);
      } else {
        // 可以处理错误情况
        console.error('Failed to fetch events:', result);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const editEvent = async () => {
    await router.push(`/events/createEvent?eventId=${article.idStr}`);
  };

  useEffect(() => {
    loadEventDetail();
  }, []);

  const article = useMemo(() => eventsDetails || {}, [eventsDetails]) as any;
  const coverImages = useMemo(() => (article?.banner ? article.banner.split(',') : []), [article]);
  const isOwner = useMemo(() => {
    const getOwner = getIsOwner();
    return getOwner(article.creator);
  }, [article, getIsOwner]);

  if (isLoading) return <PageLoader />;
  if (!article) return <NotFound />;

  const actionButtons = (
    <Tooltip label="Share" position="top" withArrow>
      <div>
        <ShareButton
          url={`/events/eventDetails/${article.idStr}/${slugit(article.title || '')}`}
          title={article.title}
        >
          <XIconButton
            className="w-[44px] flex justify-center"
            icon={(props) => <IconShare3 {...props} size={20} />}
          ></XIconButton>
        </ShareButton>
      </div>
    </Tooltip>
  );

  const maxWidth = 1200;

  return (
    <>
      <Container>
        <Stack spacing={0} mb="xl" mt={40}>
          <Group position="apart" noWrap>
            <Title weight="bold" className={classes.title} order={1}>
              {article.title}
            </Title>
            <Group align="center" className={classes.titleWrapper} noWrap>
              {isOwner && (
                <Button className="w-[130px] h-[44px]" button-type="primary" onClick={editEvent}>
                  Edit Event
                </Button>
              )}
              {!mobile && actionButtons}
              {/* <ArticleContextMenu article={article} /> */}
            </Group>
          </Group>
          <Group spacing={8}>
            {/* <Divider orientation="vertical" /> */}
            <Text color="dimmed" size="sm">
              {`Start Time: ${article?.raceStart ? formatDate(article.raceStart) : '--'}`}
            </Text>
            <Text className="ml-4 my-[20px]" color="dimmed" size="sm">
              {`End Time:  ${article?.raceFinish ? formatDate(article.raceFinish) : '--'}`}
            </Text>
          </Group>
        </Stack>
        <Grid>
          <Grid.Col xs={12}>
            <Stack spacing="xs">
              <Box
                sx={(theme) => ({
                  position: 'relative',
                  width: '100%',
                  marginBottom: '24px',
                  paddingBottom: '10px',
                  height: '515px',
                  borderRadius: theme.radius.md,
                  overflowY: 'hidden',
                  'img, .hashWrapper': {
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: theme.radius.md,
                  },
                })}
              >
                {coverImages.length === 1 ? (
                  <EdgeMedia
                    className={classes.image}
                    src={coverImages[0]}
                    cid={coverImages[0]}
                    alt={article.title}
                    width={maxWidth}
                  />
                ) : (
                  <Carousel
                    withControls
                    draggable
                    loop
                    style={{ flex: 1 }}
                    withIndicators
                    controlSize={32}
                    height={507}
                    getEmblaApi={setEmbla}
                    classNames={{
                      control: classes.carouselControl,
                      indicator: classes.carouselIndicator,
                      indicators: classes.carouselIndicators,
                    }}
                  >
                    {coverImages.map((image: any, index: number) => (
                      <Carousel.Slide key={image}>
                        {slidesInView.includes(index) && (
                          <div className="relative flex-1 h-full">
                            <EdgeMedia
                              className={classes.image}
                              src={image.url}
                              cid={image}
                              width={maxWidth}
                              loading="lazy"
                            />
                          </div>
                        )}
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                )}
              </Box>
              {article.content && (
                <ContentClamp maxHeight={200}>
                  <RenderHtml html={article.content} />
                </ContentClamp>
              )}
            </Stack>
          </Grid.Col>
        </Grid>

        <Container size="xl" my="xl" px={0}>
          <Stack spacing="md" mt={60}>
            <Group ref={discussionSectionRef} sx={{ justifyContent: 'space-between' }}>
              <Title order={2}>Discussion</Title>
            </Group>
            {/* 评论 */}
            <CommentProvider modelId={article.idStr} type={6}>
              <CommentSection />
            </CommentProvider>
          </Stack>
        </Container>
      </Container>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  titleWrapper: {
    gap: theme.spacing.xs,

    [containerQuery.smallerThan('md')]: {
      gap: theme.spacing.xs * 0.4,
    },
  },

  title: {
    wordBreak: 'break-word',
    [containerQuery.smallerThan('md')]: {
      fontSize: theme.fontSizes.xs * 3.4, // 34px
      width: '100%',
      paddingBottom: 0,
    },
  },

  badgeText: {
    fontSize: theme.fontSizes.md,
    [containerQuery.smallerThan('md')]: {
      fontSize: theme.fontSizes.sm,
    },
  },
  image: {
    width: '100%',
    height: '100%',
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
    bottom: -8,
    zIndex: 5,
    display: 'flex',
    gap: '1px', // CSS in JS 中使用字符串表示单位
  },
  carouselIndicator: {
    width: 'auto',
    height: 8,
    flex: 1,
    transition: 'width 250ms ease',
    borderRadius: 0,
    backgroundColor: 'rgba(43, 45, 48, 0.50)',
    boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)',
    [`&[data-active]`]: {
      background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
    },
  },
}));
