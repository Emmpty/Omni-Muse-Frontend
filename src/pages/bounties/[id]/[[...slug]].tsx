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
  ScrollArea,
  Image,
  Avatar,
  Flex,
} from '@mantine/core';
import { InferGetServerSidePropsType } from 'next';
import React, { useEffect, useMemo, useState } from 'react';
import XIconButton from '~/omnimuse-lib/components/XButton/XIconButton';
// import { Meta } from '~/components/Meta/Meta';
import { RenderHtml } from '~/components/RenderHtml/RenderHtml';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { formatDate, isFutureDate } from '~/utils/date-helpers';
import { ShareButton } from '~/components/ShareButton/ShareButton';
import {
  IconClockHour4,
  IconHeart,
  IconMessageCircle2,
  IconPlus,
  IconStar,
  IconUser,
  IconUsers,
  IconMenuDeep,
  IconHeartFilled,
  IconStarFilled,
} from '@tabler/icons-react';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';
import { useRouter } from 'next/router';
import { abbreviateNumber } from '~/utils/number-helpers';
import { Props as DescriptionTableProps } from '~/components/DescriptionTable/DescriptionTable';
import { getDisplayName } from '~/utils/string-helpers';
import { ContentClamp } from '~/components/ContentClamp/ContentClamp';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import { ImageViewer } from '~/components/ImageViewer/ImageViewer';
import { DaysFromNow } from '~/components/Dates/DaysFromNow';
import { IconBadge } from '~/components/IconBadge/IconBadge';
import { BountyEntryCard } from '~/components/Cards/BountyEntryCard';
import Link from 'next/link';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { ScrollAreaMain } from '~/components/ScrollArea/ScrollAreaMain';
// import axios from 'axios';
import { Carousel } from '@mantine/carousel';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { collectModel, likeModel } from '~/request/api/user';
import { getBountiesDetail, workPage } from '~/request/api/bounty';
import { workDetailResult, Result } from '~/request/api/bounty/type';
import { CommentProvider } from '~/components/CommentSection/CommentProvider';
import { CommentSection } from '~/components/CommentSection/CommentSection';
import { NoContent } from '~/components/NoContent/NoContent';
// import getDetail from '~/pages/api/bounties/detail';
import { PageLoader } from '~/components/PageLoader/PageLoader';
import dayjs from 'dayjs';
export const getServerSideProps = createServerSideProps({
  useSSG: true,
  resolver: async ({ ctx }) => {
    return { props: { id: ctx.query.id } };
  },
});

type reslutObj = {
  type: string;
  count: number;
};
export default function BountyDetailsPage({
  id,
}: // result,
InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { classes } = useStyles();
  const [bounty, setBounty] = useState<Result>({});
  const [entriesList, setEntriesList] = useState<workDetailResult>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoriteTotal, setFavoriteTotal] = useState<number>(0);
  const [collectedTotal, setCollectedTotal] = useState<number>(0);

  useEffect(() => {
    upDataDatasetDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultBadgeProps: BadgeProps = {
    radius: 'sm',
    size: 'lg',
    color: 'gray',
    sx: { cursor: 'pointer' },
  };

  // 更新赏金详情
  const upDataDatasetDetail = async () => {
    setLoading(true);
    const res = await getBountiesDetail({ id });
    if (res.code === 200) {
      setBounty(res.result);
      setFavoriteTotal(res.result.track_count_all_time);
      setCollectedTotal(res.result.favorite_count_all_time);
      getEntriesList();
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  // 更新详情数据
  const handleMessageFromChild = (data: reslutObj) => {
    if (data.type === 'favorite') {
      // 点赞
      setFavoriteTotal(data.count);
    } else if (data.type === 'collected') {
      // 收藏
      setCollectedTotal(data.count);
    }
  };

  const iconStyle = {
    root: {
      backgroundColor: 'transparent',
      padding: '0px',
    },
  };

  const getEntriesList = async () => {
    const res = await workPage({ id: id });
    if (res.code === 200) {
      setEntriesList(res.result.records);
    }
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <>
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
                        styles={iconStyle}
                        {...defaultBadgeProps}
                        icon={<Image src="/images/icon/gold.svg" width={14} alt="" />}
                      >
                        {abbreviateNumber(bounty.unit_amount ?? 0)}
                      </IconBadge>
                    </LoginRedirect>
                    <IconBadge
                      size="lg"
                      radius="sm"
                      icon={<IconClockHour4 size={18} />}
                      style={{ color: '#FFF', background: 'transparent' }}
                    >
                      {/* <DaysFromNow date={bounty?.expires_at} withoutSuffix /> */}
                      {dayjs(bounty.expires_at).fromNow()}
                    </IconBadge>
                    <LoginRedirect reason="perform-action">
                      <IconBadge
                        {...defaultBadgeProps}
                        styles={iconStyle}
                        icon={<IconHeart size={18} />}
                      >
                        {abbreviateNumber(favoriteTotal ?? 0)}
                      </IconBadge>
                    </LoginRedirect>
                    <IconBadge
                      {...defaultBadgeProps}
                      styles={iconStyle}
                      icon={<IconMessageCircle2 size={18} />}
                    >
                      {abbreviateNumber(bounty?.comment_count_all_time ?? 0)}
                    </IconBadge>
                    <IconBadge
                      {...defaultBadgeProps}
                      styles={iconStyle}
                      icon={<IconStar size={18} />}
                      sx={undefined}
                    >
                      {abbreviateNumber(collectedTotal ?? 0)}
                    </IconBadge>
                    <IconBadge
                      {...defaultBadgeProps}
                      styles={iconStyle}
                      icon={<IconUsers size={18} />}
                      sx={undefined}
                    >
                      {abbreviateNumber(bounty?.entry_count_all_time ?? 0)}
                    </IconBadge>
                  </Group>
                </Group>
              </Group>
              <Group spacing={8}>
                <Text color="dimmed" size="xs">
                  {formatDate(bounty.starts_at, undefined, true)}
                </Text>
              </Group>
            </Stack>
            <ContainerGrid gutterMd={32} gutterLg={64}>
              <ContainerGrid.Col xs={12} md={4} orderMd={2}>
                <BountySidebar bounty={bounty} sendMessageToParent={handleMessageFromChild} />
              </ContainerGrid.Col>
              <ContainerGrid.Col xs={12} md={8} orderMd={1}>
                <Stack spacing="xs" className="w-full">
                  {bounty?.image_id?.length == 1 ? (
                    <div className="w-full flex justify-center ">
                      <div className="w-[370px] h-[506px] rounded-lg overflow-hidden">
                        <EdgeMedia
                          src={bounty?.image_id[0]}
                          cid={bounty?.image_id[0]}
                          width={374}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ) : (
                    <Carousel
                      draggable
                      loop
                      controlSize={56}
                      height={506}
                      slideSize="50%"
                      breakpoints={[{ maxWidth: 'sm', slideSize: '70%', slideGap: 'xl' }]}
                      slideGap="xl"
                      align="start"
                      slidesToScroll={2}
                      styles={{
                        control: {
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: 'none',
                          color: '#FFF',
                          svg: {
                            width: '30px',
                            height: '30px',
                          },
                        },
                      }}
                    >
                      {bounty?.image_id?.map((image, index) => (
                        <Carousel.Slide key={index}>
                          <div className="h-[506px] rounded-lg overflow-hidden">
                            <EdgeMedia src={image} cid={image} width={374} loading="lazy" />
                          </div>
                        </Carousel.Slide>
                      ))}
                    </Carousel>
                  )}

                  <article style={{ marginTop: '20px' }}>
                    <Stack spacing={4}>
                      {bounty.description && (
                        <ContentClamp maxHeight={200}>
                          <RenderHtml html={bounty.description} />
                        </ContentClamp>
                      )}
                    </Stack>
                  </article>
                </Stack>
              </ContainerGrid.Col>
            </ContainerGrid>
          </Container>
          <BountyEntries bounty={bounty} entriesList={entriesList} />

          <Container size="xl" my="xl">
            <Stack spacing="md">
              <Group sx={{ justifyContent: 'space-between' }}>
                <Group spacing="xs">
                  <Title order={2}>Discussion</Title>
                </Group>
              </Group>
              {bounty?.id && (
                <CommentProvider modelId={bounty.id} type={4}>
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

const BountySidebar = ({
  bounty,
  sendMessageToParent,
}: {
  bounty: Result;
  sendMessageToParent: (data: reslutObj) => void;
}) => {
  const { classes } = useStyles();
  const router = useRouter();
  // console.log(router);

  const [isfollowed, setIsFollowed] = useState<number | boolean>(bounty.isLike);
  const [isCollect, setIsCollect] = useState<number | boolean>(bounty.isStar);

  const bountyDetails: DescriptionTableProps['items'] = [
    {
      label: 'Bounty Type',
      value: <div>{bounty.type && getDisplayName(bounty.type)}</div>,
    },
    {
      label: 'Base Model',
      value: <div>{bounty?.mode}</div>,
    },
    {
      label: isFutureDate(bounty.starts_at) ? 'Starts at' : 'Started',
      value: <Text>{formatDate(bounty.starts_at, undefined, true)}</Text>,
    },
    {
      label: 'Deadline',
      value: <Text>{formatDate(bounty.expires_at, undefined, true)}</Text>,
    },
  ];

  const updatEparentComponent = (data: reslutObj): void => {
    sendMessageToParent(data);
  };

  // 点赞
  const handleToggleFavorite = async ({
    versionId,
    setTo,
  }: {
    versionId?: number;
    setTo: boolean;
  }) => {
    // console.log(versionId, setTo);
    const modelId = bounty?.id;
    const operation = setTo;
    const modelVersionId = versionId;
    if (modelId && modelVersionId) {
      const res = await likeModel({ contentId: modelVersionId, type: 3, operation });
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
      const res = await collectModel({ contentId: modelVersionId, type: 3, operation });
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
  const linkCreate = () => {
    router.push('/bounties/create?id=' + router.query.id);
  };

  const btnGroup = (
    <>
      <Tooltip label={isfollowed ? 'Unlike' : 'Like'} position="top">
        <div>
          <LoginRedirect reason="add-to-collection">
            <XIconButton
              className={isfollowed ? 'text-red-600' : ''}
              icon={isfollowed ? () => <IconHeartFilled /> : () => <IconHeart />}
              onClick={() => handleToggleFavorite({ versionId: bounty.id, setTo: !isfollowed })}
            ></XIconButton>
          </LoginRedirect>
        </div>
      </Tooltip>
      <Tooltip label={isCollect ? 'Collected' : 'Not collected'} position="top">
        <div style={{ marginLeft: 'auto' }}>
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
      <Tooltip label="Share" position="top">
        <div style={{ marginLeft: 'auto' }}>
          <ShareButton url={router.asPath} title={bounty.name}>
            <XIconButton
              className={isCollect ? 'text-yellow-400' : ''}
              icon={() => <Image src="/images/icon/share.svg" size={20} alt="" />}
              onClick={() => {
                handleCollect();
              }}
            ></XIconButton>
          </ShareButton>
        </div>
      </Tooltip>
    </>
  );

  const editBtnGroup = (
    <>
      <Button
        className="w-[337px]"
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
      <Tooltip label="Share" position="top">
        <div style={{ marginLeft: 'auto' }}>
          <ShareButton url={router.asPath} title={bounty.name}>
            <XIconButton
              className={isCollect ? 'text-yellow-400' : ''}
              icon={() => <Image src="/images/icon/share.svg" width={20} alt="" />}
              onClick={() => {
                handleCollect();
              }}
            ></XIconButton>
          </ShareButton>
        </div>
      </Tooltip>
    </>
  );

  return (
    <Stack spacing="md">
      <Group spacing={8} noWrap>
        <Group spacing={8} noWrap>
          <Flex
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="nowrap"
            style={{ width: '100%' }}
          >
            {router.query.type == 'edit' ? editBtnGroup : btnGroup}
          </Flex>
        </Group>
      </Group>
      <Accordion
        variant="separated"
        multiple
        defaultValue={['details', 'benefactors']}
        styles={(theme) => ({
          content: { padding: 0 },
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
          <Accordion.Control>
            <Group>
              <IconMenuDeep style={{ transform: 'scaleX(-1)' }} />
              Overview
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <ul className="px-[20px] py-[20px]">
              {bountyDetails.map((item, index) => (
                <li className="flex justify-between items-stretch mb-[20px] last:mb-0 " key={index}>
                  <div className="text-[#9B9C9E]">{item.label}</div>
                  <div className="text-white text-[14px]">{item.value}</div>
                </li>
              ))}
            </ul>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="benefactors">
          <Accordion.Control>
            <div className="flex justify-start items-center">
              <div className="mr-1">
                <IconUser></IconUser>
              </div>
              <div>
                <Group position="apart">Supporters</Group>
              </div>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <ScrollArea.Autosize maxHeight={500}>
              <Group position="apart" noWrap className="px-[20px] py-[20px]">
                <Link href={`/user/${bounty?.user_id}/bounties`} passHref>
                  <div className="flex justify-start items-center cursor-pointer">
                    <div>
                      <Avatar src={bounty?.image} size={40} radius="xl" />
                    </div>
                    <div className="ml-2">
                      <div className="text-[#FFF] w-[250px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {bounty?.username}
                      </div>
                      <Text size="xs" color="dimmed">
                        <DaysFromNow date={bounty?.created_at} />
                      </Text>
                    </div>
                  </div>
                </Link>
                <Group>
                  <div>
                    <Image
                      src="/images/icon/gold.svg"
                      width={24}
                      height={24}
                      className="m-auto"
                      alt=""
                    />
                    <div className="text-center text-[12px] text-[#FFF]">{bounty?.unit_amount}</div>
                  </div>
                </Group>
              </Group>
            </ScrollArea.Autosize>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
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
  },
}));

const BountyEntries = ({
  bounty,
  entriesList,
}: {
  bounty: Result;
  entriesList: workDetailResult;
}) => {
  const entryCreateUrl = `/bounties/${bounty.id}/entries/create`;

  const hiddenCount = 0;

  const listData = useMemo(() => {
    return entriesList;
  }, [entriesList]);
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Container fluid my="md">
      <Container size="xl">
        <Stack spacing="md" py={32}>
          <Group>
            <Title order={2}>Entries</Title>
            <Link href={entryCreateUrl}>
              <a>
                <div
                  className="flex justify-start items-center px-[10px] py-[6px] rounded-lg border text-[12px] text-[#FFF] font-semibold"
                  style={{
                    borderColor: '#9A5DFF',
                  }}
                >
                  <IconPlus size={14} /> &nbsp; Submit Entry
                </div>
              </a>
            </Link>
            {hiddenCount > 0 && (
              <Text color="dimmed">
                {hiddenCount.toLocaleString()} entries have been hidden due to your settings or due
                to lack of images
              </Text>
            )}
          </Group>
          {children}
        </Stack>
      </Container>
    </Container>
  );

  return (
    <Wrapper>
      {listData.length > 0 && (
        <SimpleGrid
          spacing="sm"
          breakpoints={[
            { minWidth: 'xs', cols: 1 },
            { minWidth: 'sm', cols: 2 },
            { minWidth: 'md', cols: 4 },
          ]}
          style={{ width: '100%', height: '516px' }}
        >
          {listData.map((item: any) => (
            <BountyEntryCard
              key={item?.id}
              data={item}
              currency={bounty.unit_amount}
              renderActions={() => {
                return <></>;
              }}
            />
          ))}
        </SimpleGrid>
      )}
      {entriesList.length === 0 && <NoContent iconSize={60} />}
    </Wrapper>
  );
};

setPageOptions(BountyDetailsPage, {
  innerLayout: ({ children }: { children: React.ReactNode }) => (
    <ImageViewer>
      <ScrollAreaMain>{children}</ScrollAreaMain>
    </ImageViewer>
  ),
});
