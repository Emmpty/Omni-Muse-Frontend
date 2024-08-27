import {
  Button,
  Center,
  Loader,
  Stack,
  Text,
  Group,
  createStyles,
  Checkbox,
  Modal,
} from '@mantine/core';
import { IconInbox, IconTrash } from '@tabler/icons-react';
import { QueueItem } from '~/components/ImageGeneration/QueueItem_latest';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { IconArrowsDiagonal, IconX } from '@tabler/icons-react';
import { queuelist, deleteQueue } from '~/request/api/generate';
import { useGenerationnnnnStore } from '~/store/generationnnnn.store';
import { HDImage } from '~/components/HDCard/HDImage';
import socket from '~/request/websocket';
import { openConfirmModal } from '@mantine/modals';

export function Queue({
  onClose,
  toGenerate,
  onPost,
  onDelImage,
  onRedraw,
  notify,
  reloadC,
  /* geneation need */ onCheck: onIndexCheck,
}: any) {
  // 监听盒子开启关闭状态
  const { classes, cx } = useStyles();
  const router = useRouter();
  const isGeneratePage = router.pathname.startsWith('/generate');
  const { afterGenerated, setTaskId } = useGenerationnnnnStore();
  // 页面加载相关
  const [page, setPage] = useState(1);
  const [hasData, setStatus] = useState(true);
  const [list, setResult] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  // index 页面通知 生成就重新刷新列表
  useEffect(() => {
    cb();
  }, [afterGenerated]);

  const [compareInformation, setCompareInformation] = useState();

  useEffect(() => {
    socket.subscribe((message: any) => {
      console.log(message, 'Websocket 信息推送成功');
      setCompareInformation(message);
    });
  }, []);

  useEffect(() => {
    compareInformation && onCompareInformation(compareInformation);
  }, [compareInformation]);

  // 比对数据
  const onCompareInformation = (message: any) => {
    const {
      payload: { idStr, cid, queue },
    }: any = message;
    if (!list.length) {
      return;
    }
    console.log('正在处理推送的数据');
    const data = list.map((item: any) => {
      if (item.idStr === queue) {
        return Object.assign({}, item, {
          taskList: item.taskList.map((v: any) => {
            console.log(idStr, v.idStr, '推送的idStr');
            if (v.idStr === idStr) {
              console.log('推送的数据比对成功!!!!!!');
              return Object.assign({}, v, {
                status: 0,
                cid,
              });
            }
            return v;
          }),
        });
      }
      return item;
    });

    setResult(data);
  };

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
    queuelist({
      pageNum: reload ? 1 : page,
      pageSize: 10,
    })
      .then((resp: any) => {
        setPage(page + 1);
        const data = resp?.result?.records || [];
        const _data = data
          // .map((_: any) => Object.assign(_, { params: JSON.parse(_.params || '{}') }))
          .map(({ params = '{}', model = {}, vae = '', resources = [], ...props }: any) => {
            const {
              model_id: modelId,
              cfg_scale: cfgScale,
              negative_prompt: negativePrompt,
              size,
              ...nparams
            } = JSON.parse(params);

            const item = Object.assign({}, props, {
              params: {
                ...nparams,
                modelId: +modelId,
                cfgScale,
                negativePrompt,
                size: size + '',
                batch: +props.batchNum,
                vae,
                resources,
              },
              info: {
                Sampler: nparams.sampler,
                Steps: nparams.steps,
                'Cfg scale': cfgScale,
                Width: size == 0 ? '1024' : size == 1 ? '1216' : '832',
                Height: size == 0 ? '1024' : size == 1 ? '832' : '1216',
                Seed: nparams.seed,
                // 'Clip skip': model?.clipSkip || props.modelVersion?.clip_skip,
                'Base model': nparams?.base_model,
              },
              model,
            });
            return item;
          });
        const _list = reload ? _data : list.concat(_data);
        setResult(_list);
        setStatus(!!data.length);
      })
      .finally(() => {
        setIsLoad(false);
        setIsLoading(false);
      });
  };

  const handleRedrwa = (idStr: any) => {
    setTaskId(idStr);
    onRedraw && onRedraw();
  };

  // 勾选相关
  const [selectIds, setSelectIds] = useState<any>([]);
  const onChange = (v: any) => {
    if (onIndexCheck) onIndexCheck(v);
    setSelectIds(v);
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
  // 删除记录
  const onDelItem = (id: any) => {
    openConfirmModal({
      centered: true,
      title: 'Delete',
      children: 'Are you sure to delete the image list?',
      labels: { cancel: `Cancel`, confirm: `Confirm` },
      className: 'hd-confirm-model',
      onConfirm: () => {
        deleteQueue({ list: [id] }).then(() => cb());
      },
    });
  };

  // 回调函数
  const cb = () => {
    setSelectIds([]);
    load(true);
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

  return isLoading ? (
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
    <>
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
      <Stack
        className={cx(classes.root)}
        style={{
          backgroundColor: isGeneratePage ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
          height: isGeneratePage ? 'calc(100% - 10px)' : 'calc(100% - 90px)',
        }}
      >
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

        {!!list?.length ? (
          <Checkbox.Group
            value={selectIds}
            onChange={(value) => onChange(value)}
            style={{ paddingTop: '0px', marginTop: '-16px' }}
          >
            <div
              ref={queueScroll}
              className="scrollxxx"
              style={{
                padding: isGeneratePage ? '0 10px 0 20px' : '0 8px',
                height: isGeneratePage ? 'calc(100vh - 176px)' : 'calc(100vh - 246px)',
                marginBottom: '12px',
                width: '100%',
              }}
              onScroll={onScroll}
            >
              {list.map((details) => (
                <div key={details.id}>
                  {QueueItem({
                    isGeneratePage,
                    details,
                    onDelItem,
                    onRedraw: handleRedrwa,
                    openImage,
                  })}
                </div>
              ))}
            </div>
          </Checkbox.Group>
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
                  The queue is empty
                </Text>
                <Text size="sm" color="dimmed">
                  Try <Text span>generating</Text> new images with our resources
                </Text>
              </Stack>
            </Stack>
          </Center>
        )}
      </Stack>
    </>
  );
}

const useStyles = createStyles((theme) => ({
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
      boxSizing: 'border-box',
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
    fontFamily: 'PingFang SC !important',
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
    '.mantine-1avyp1d': {
      '.mantine-Accordion-item': {
        backgroundColor: 'rgba(43, 45, 48, 0.50)',
        '.mantine-Paper-root': {
          backgroundColor: 'transparent',
        },
      },
    },
    'tr.mantine-1avyp1d': {
      td: {
        // backgroundColor: 'rgba(43, 45, 48, 0.50)',
        backgroundColor: 'transparent',
        border: 'none !important',
        padding: '7px 16px',
        '.mantine-Text-root': {
          color: 'rgb(155, 156, 158) !important',
        },
      },
    },
    '& .mantine-Card-root': {
      backgroundColor: 'rgba(43, 45, 48, 0.50) !important',
      '& .mantine-Accordion-control': {
        height: '50px',
        color: '#fff',
      },
    },
    '& .mantine-Spoiler-control': {
      color: '#9A5DFF',
    },
    '& .mantine-Badge-root': {
      background: 'rgba(43, 45, 48, 0.50) !important',
      color: '#fff',
      borderRadius: '33px',
      padding: '4px 20px',
      borderColor: '#2B2D30',
      height: '26px',
      marginBottom: '6px',
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
      borderWidth: '0 !important',
    },
    '& input:checked': {
      backgroundColor: '#9A5DFF !important',
      borderWidth: '0 !important',
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
