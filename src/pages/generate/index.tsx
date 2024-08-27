import { Center, Group, Stack, Tabs, Text, ThemeIcon, createStyles, Button } from '@mantine/core';
import { IconLock, IconTrash, IconArrowsDiagonalMinimize } from '@tabler/icons-react';
import React, { useState } from 'react';
import { setPageOptions } from '~/components/AppLayout/AppLayout';
import { Feed } from '~/components/ImageGeneration/Feed';
import { Queue } from '~/components/ImageGeneration/Queue';
import { ScrollArea } from '~/components/ScrollArea/ScrollArea';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { useLoginAuthentication } from '~/hooks/useLoginAuthentication';
import { createServerSideProps } from '~/server/utils/server-side-helpers';
import { generationPanel } from '~/store/generation.store';
import { deleteImage } from '~/request/api/generate';
import { useGenerationnnnnStore } from '~/store/generationnnnn.store';
import { useEffect } from 'react';
import { imagepublish } from '~/request/api/generate';
import { useRouter } from 'next/router';
import { openConfirmModal } from '@mantine/modals';
/**
 * NOTE: This is still a WIP. We are currently working on a new design for the
 * image generation page. This is a temporary page until we have the new design
 */
export const getServerSideProps = createServerSideProps({
  useSession: true,
  resolver: async ({ features }) => {
    if (!features?.imageGeneration) return { notFound: true };
  },
});

export default function GeneratePage() {
  const currentUser = useCurrentUser();
  const { classes } = useStyles();
  const [tab, setTab] = useState<string>('queue');
  const router = useRouter();

  const { initFlag } = useLoginAuthentication();

  const [list, setIds] = useState<any>([]);
  const [notify, setNotify] = useState<any>(1);
  const [reload, setReload] = useState<any>(1);
  const [key, setkey] = useState<any>(1);

  const { open } = useGenerationnnnnStore();

  useEffect(() => {
    open();
  }, []);

  const onCheck = (v: any) => {
    setIds(v);
  };

  const onOpen = () => {
    router.back();
    generationPanel.open();
  };

  const onDelImage = () => {
    openConfirmModal({
      centered: true,
      title: 'Delete',
      children: 'Are you sure to delete the image?',
      labels: { cancel: `Cancel`, confirm: `Confirm` },
      className: 'hd-confirm-model',
      onConfirm: () => {
        deleteImage({
          list,
        }).then(() => {
          setIds([]);
          setReload(reload + 1);
        });
      },
    });
  };

  const onPost = () => {
    openConfirmModal({
      centered: true,
      title: 'Post',
      children: 'Are you sure to publish this image to the gallery?',
      labels: { cancel: `Cancel`, confirm: `Confirm` },
      className: 'hd-confirm-model',
      onConfirm: () => {
        imagepublish({
          list,
        })
          .then((resp) => {
            // todo
            // if (resp.code == 200) {

            // }
            setIds([]);
            setNotify(notify + 1);
          })
          .catch((resp) => {
            console.log(resp, '???');
          });
      },
    });
  };

  if (!initFlag) {
    return <></>;
  }

  if (currentUser?.muted)
    return (
      <Center h="100%" w="75%" mx="auto">
        <Stack spacing="xl" align="center">
          <ThemeIcon size="xl" radius="xl" color="yellow">
            <IconLock />
          </ThemeIcon>
          <Text align="center">
            You have been muted, your account will be reviewed by a Community Manager within 48
            hours. You will be notified if your account is unmuted. You do not need to contact us.
          </Text>
        </Stack>
      </Center>
    );

  // desktop view
  return (
    <Tabs
      variant="pills"
      value={tab}
      onTabChange={(tab) => {
        // tab can be null
        if (tab) setTab(tab);
      }}
      radius="xl"
      color="gray"
      classNames={classes}
    >
      <Tabs.List
        px="md"
        py="xs"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Group
          position="apart"
          w="100%"
          style={{
            height: '60px',
          }}
        >
          <Group align="flex-start">
            <Tabs.Tab value="queue" onClick={() => setkey(key + 1)}>
              Queue
            </Tabs.Tab>
            <Tabs.Tab value="feed" onClick={() => setkey(key + 1)}>
              Feed
            </Tabs.Tab>
          </Group>
          <Group position="right" spacing="xs">
            {!!list.length ? (
              <div className="icon-wrap">
                <IconTrash size={18} color="#fff" onClick={onDelImage} />
              </div>
            ) : (
              ''
            )}
            <Button
              variant="filled"
              size="xs"
              style={{
                background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
                padding: '0 24px',
                height: '36px',
                border: 'none',
              }}
              onClick={onPost}
              disabled={!list.length}
            >
              Post
            </Button>

            <div className="icon-wrap">
              <IconArrowsDiagonalMinimize
                size={20}
                color="#fff"
                style={{ transform: 'rotate(90deg)' }}
                onClick={onOpen}
              />
            </div>
          </Group>
        </Group>
      </Tabs.List>
      <ScrollArea scrollRestore={{ key: tab }} style={{ paddingTop: 0 }}>
        <Tabs.Panel
          value="queue"
          style={{
            paddingTop: '20px',
          }}
        >
          <Queue key={key} onCheck={onCheck} notify={notify} reloadC={reload} />
        </Tabs.Panel>
        <Tabs.Panel
          value="feed"
          style={{
            paddingTop: '10px',
          }}
        >
          <Feed key={key} onCheck={onCheck} notify={notify} reloadC={reload} />
        </Tabs.Panel>
      </ScrollArea>
    </Tabs>
  );
}

setPageOptions(GeneratePage, { withScrollArea: false });

const useStyles = createStyles((theme) => {
  return {
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      '.icon-wrap': {
        borderRadius: '10px',
        border: '1px solid #2B2D30',
        background: 'rgba(43, 45, 48, 0.50)',
        padding: '0 7px',
        cursor: 'pointer',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
      },
      '& button[data-disabled]': {
        opacity: '0.8',
        color: '#fff',
      },
      '.mantine-Tabs-tabsList': {
        borderBottom: 'none',
        paddingTop: 0,
        paddingBottom: 0,
        height: '60px',
        fontWeight: 600,
        '.mantine-UnstyledButton-root': {
          paddingLeft: '26px',
          paddingRight: '26px',
          '&[aria-selected=true]': {
            border: '1px solid #9A5DFF',
            borderRadius: '8px',
            background:
              'linear-gradient(90deg, rgba(154, 93, 255, 0.10) 0%, rgba(119, 96, 255, 0.10) 100%)',
          },
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    panel: {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    },
    tabsList: {
      width: '100%',
      borderBottom:
        theme.colorScheme === 'dark'
          ? `1px solid ${theme.colors.dark[5]}`
          : `1px solid ${theme.colors.gray[2]}`,
    },
  };
});
