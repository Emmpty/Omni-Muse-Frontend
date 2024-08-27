import {
  Stack,
  createStyles,
  SimpleGrid,
  Paper,
  Checkbox,
  Button,
  Group,
  Center,
  Loader,
  Modal,
  Text,
} from '@mantine/core';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { IconArrowsDiagonal, IconX } from '@tabler/icons-react';
import { imageslist } from '~/request/api/generate';
import { useGenerationnnnnStore } from '~/store/generationnnnn.store';
import { HDImage } from '~/components/HDCard/HDImage';
import { IconInbox, IconTrash, IconPhoto, IconPhotoX } from '@tabler/icons-react';
export function Feed({
  onClose,
  toGenerate,
  onPost,
  onDelImage,
  notify,
  reloadC,
  /* geneation need */ onCheck: onIndexCheck,
}: any) {
  const { afterGenerated } = useGenerationnnnnStore((state: any) => state.afterGenerated);
  useEffect(() => {
    cb();
  }, [afterGenerated]);
  const router = useRouter();
  const isGeneratePage = router.pathname.startsWith('/generate');
  const { classes, cx } = useStyle();
  const [page, setPage] = useState(1);
  const [hasData, setStatus] = useState(true);
  const [result, setResult] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const load = (reload = false) => {
    if (isLoading) return;
    if (isLoad) return;
    if (reload) {
      setIsLoading(true);
      setPage(1);
    } else {
      if (!hasData) return;
    }
    setIsLoad(true);
    imageslist({
      pageNum: reload ? 1 : page,
      pageSize: isGeneratePage ? 50 : 10,
    })
      .then((resp: any) => {
        setPage(page + 1);
        const data = resp?.result?.records || [];
        setResult(reload ? data : result.concat(data));
        setStatus(!!data.length);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoad(false);
      });
  };
  const cb = () => {
    setPage(1);
    setSelectIds([]);
    load(true);
  };

  useEffect(() => {
    setSelectIds([]);
  }, [notify]);
  useEffect(() => {
    if (reloadC > 1) {
      setSelectIds([]);
      setPage(1);
      load(true);
    }
  }, [reloadC]);

  const [selectIds, setSelectIds] = useState<any>([]);
  const onChange = (v: any) => {
    if (onIndexCheck) onIndexCheck(v);
    setSelectIds(v);
  };

  const queueScroll = useRef<any>();
  const onScroll = (e: any) => {
    // 滚动条的总高度 el.scrollHeight
    const scrollHeight = e.target.scrollHeight;
    // 可视区的高度 el.clientHeight
    const height = e.target.clientHeight;
    // 滚动条距离顶部高度 el.scrollTop
    const scrollTop = e.target.scrollTop;
    console.log('加载数据');
    if (scrollHeight - scrollTop - height < 200) {
      load(false);
    }
  };
  const [opened, setOpened] = useState(false);
  const [openImageCid, setOpenImageCid] = useState('');
  const [imageStyle, setImageStyle] = useState({});

  const openImage = (cid: any, width: number, height: number) => {
    setOpenImageCid(cid);
    setOpened(true);
    setImageStyle({
      width: width + 'px',
      height: height + 'px',
      maxWidth: width == height ? '800px' : width > height ? '1000px' : '600px',
      maxHeight: width > height ? '600px' : '800px',
    });
  };
  return (
    <>
      {isLoading ? (
        <Center
          p="xl"
          style={{
            height: isGeneratePage ? '100%' : 'calc(100% - 90px)',
            backgroundColor: isGeneratePage ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Loader />
        </Center>
      ) : (
        <Stack
          className={classes.root}
          style={{
            backgroundColor: isGeneratePage ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
            height: isGeneratePage ? '100%' : 'calc(100% - 90px)',
          }}
        >
          <Modal
            opened={opened}
            centered
            size="100%"
            style={{ height: '100vh' }}
            onClose={() => setOpened(false)}
            title=""
            className={classes.dialog}
          >
            {/* Modal content */}
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <HDImage src={openImageCid} hover={false} style={imageStyle} />
            </div>
          </Modal>

          {!isGeneratePage && (
            <Group
              position="right"
              spacing="xs"
              sx={(theme) => ({
                position: 'relative',
                borderBottom: `1px solid ${
                  theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
                padding: '12px 16px',
              })}
              className={classes.iconWrap}
            >
              {!!selectIds.length ? (
                <div className="icon-wrap" style={{ cursor: 'pointer', marginRight: 'auto' }}>
                  <IconTrash size={18} color="#fff" onClick={() => onDelImage(selectIds, cb)} />
                </div>
              ) : (
                ''
              )}
              <Button
                variant="filled"
                size="xs"
                onClick={() => onPost(selectIds, () => setSelectIds([]))}
                style={{
                  background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
                  padding: '0 24px',
                  height: '36px',
                  border: 'none',
                }}
                disabled={!selectIds.length}
              >
                Post
              </Button>

              <div className="icon-wrap">
                <IconArrowsDiagonal color="#fff" size={20} onClick={toGenerate} />
              </div>
              <div className="icon-wrap">
                <IconX size={20} color="#fff" onClick={onClose} />
              </div>
            </Group>
          )}
          {result.length > 0 ? (
            <div
              className="scrollxxx"
              ref={queueScroll}
              style={{
                padding: isGeneratePage ? '0 10px 0 20px' : '0 8px',
                height: isGeneratePage ? 'calc(100vh - 190px)' : 'calc(100vh - 254px)',
                marginBottom: '12px',
              }}
              onScroll={onScroll}
            >
              <Checkbox.Group value={selectIds} onChange={(value) => onChange(value)}>
                <SimpleGrid
                  spacing="sm"
                  breakpoints={[
                    { minWidth: 'xs', cols: 1 },
                    { minWidth: 'sm', cols: 2 },
                    {
                      minWidth: 'md',
                      cols: isGeneratePage ? 5 : 2,
                    },
                  ]}
                  style={{ width: '100%' }}
                >
                  {(result as any).map(({ cid, idStr, status, ...item }: any, index: any) =>
                    status > 0 ? (
                      <Paper
                        key={idStr}
                        radius="sm"
                        p={0}
                        sx={{ position: 'relative', overflow: 'hidden', height: 172 }}
                        withBorder
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                          }}
                        >
                          {/* <IconPhoto /> */}
                          <Loader size={16} />
                          <div
                            style={{
                              color: '#9B9C9E',
                              fontSize: '12px',
                              marginTop: '8px',
                            }}
                          >
                            Generating
                          </div>
                        </div>
                      </Paper>
                    ) : status < 0 ? (
                      <Paper
                        key={idStr}
                        radius="sm"
                        p={0}
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          height: isGeneratePage
                            ? 172
                            : item.width == item.height
                            ? 150
                            : item.width > item.height
                            ? 100
                            : 200,
                        }}
                        withBorder
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                          }}
                        >
                          <IconPhotoX />
                          <div
                            style={{
                              color: '#9B9C9E',
                              fontSize: '12px',
                              marginTop: '8px',
                            }}
                          >
                            Build failed
                          </div>
                        </div>
                      </Paper>
                    ) : (
                      <Paper
                        key={cid + '' + index}
                        radius="sm"
                        p={0}
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          height: isGeneratePage
                            ? 172
                            : item.width == item.height
                            ? 150
                            : item.width > item.height
                            ? 100
                            : 200,
                        }}
                        withBorder
                      >
                        <HDImage
                          src={cid}
                          onClick={() => {
                            openImage(cid, item.width, item.height);
                          }}
                        />
                        <div style={{ position: 'absolute', top: 12, left: 12 }}>
                          <Checkbox value={idStr} />
                        </div>
                      </Paper>
                    )
                  )}
                </SimpleGrid>
              </Checkbox.Group>
            </div>
          ) : (
            <Center
              style={{
                backgroundColor: isGeneratePage ? 'transparent' : '#000',
                height: '100%',
              }}
            >
              <Stack spacing="xs" align="center" py="16">
                <IconInbox size={64} stroke={1} />
                <Stack spacing={0}>
                  <Text size="md" align="center">
                    The feed is empty
                  </Text>
                  <Text size="sm" color="dimmed">
                    Try <Text span>generating</Text> new images with our resources
                  </Text>
                </Stack>
              </Stack>
            </Center>
          )}
        </Stack>
      )}
    </>
  );
}

const useStyle = createStyles(() => ({
  iconWrap: {
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
  },
  dialog: {
    '.mantine-Modal-inner': {
      padding: '0 !important',
      '.mantine-Paper-root': {
        height: '100vh',
        overflow: 'hidden',
        '.mantine-Modal-body': {
          height: 'calc(100% - 62px)',
        },
      },
    },
  },
  root: {
    '.mantine-SimpleGrid-root .mantine-Paper-root': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
    },
    '.scrollxxx': {
      overflow: 'hidden',
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '1px',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
        background: 'rgba(254, 254, 254, 0.4)',
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
        width: '10px',
        background: 'transparent',
      },
    },
    '& button[data-disabled]': {
      opacity: '0.8',
      color: '#fff',
    },
    '& .mantine-Select-dropdown div[data-selected=true]': {
      backgroundColor: '#9A5DFF !important',
    },
    '& .mantine-MultiSelect-values': {
      height: '46px',
    },
    '& .mantine-Input-input:focus-within': {
      borderColor: '#9A5DFF !important',
    },
    '& .mantine-Input-input:focus': {
      borderColor: '#9A5DFF !important',
    },
    '& input:focus': {
      borderColor: '#9A5DFF !important',
    },
    '& .mantine-Checkbox-inner input': {
      backgroundColor: '#2B2D30',
    },
    '& input:checked': {
      backgroundColor: '#9A5DFF !important',
      borderColor: '#7760FF !important',
    },
    '& input': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
    },
    '& .mantine-MultiSelect-input': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      '& input': {
        backgroundColor: 'transparent',
      },
    },
    '& .mantine-SegmentedControl-label': {
      backgroundColor: 'transparent',
    },
    '& .mantine-SegmentedControl-root': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
    },
    '& .mantine-RichTextEditor-root': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
    },
    '& .mantine-Dropzone-root': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
    },
    '& .mantine-RichTextEditor-content,& .mantine-Group-root': {
      backgroundColor: 'transparent',
    },
  },
}));
