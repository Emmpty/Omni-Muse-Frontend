import { createStyles, Stack, Group, Button, Box } from '@mantine/core';
import { IconBrush, IconListDetails, IconSlideshow } from '@tabler/icons-react';
import { Feed } from './Feed';
import { Queue } from './Queue';
import { useEffect, useState } from 'react';
import { GenerationForm } from './GenerationForm/GenerationForm';
import { useRouter } from 'next/router';
import {
  draftCreate,
  deleteImage,
  imagepublish,
  taskDetail,
  ImageDetail,
} from '~/request/api/generate';
import { getInfoByVersionId } from '~/request/api/model';
import { showNotification } from '@mantine/notifications';
import { useGenerationnnnnStore } from '~/store/generationnnnn.store';
import { openConfirmModal } from '@mantine/modals';

export default function GenerationTabs({}: any) {
  const {
    onAfterGenerated,
    close,
    defaultModelVersionId,
    defaultTaskId,
    setTaskId,
    defaultImageId,
    setImageId,
  } = useGenerationnnnnStore();
  const router = useRouter();
  const [isGeneratePage, setisGeneratePage] = useState(false);
  useEffect(() => {
    setisGeneratePage(router.pathname.startsWith('/generate'));
  }, []);
  useEffect(() => {
    setisGeneratePage(router.pathname.startsWith('/generate'));
  }, [router.pathname]);

  const { classes } = useStyles();

  const [view, setView] = useState('generate');
  const [modelKey, setModelKey] = useState(0);
  const [model, setModel] = useState({
    modelId: 0,
    resources: [],
    prompt: '',
    negativePrompt: '',
    size: '0',
    cfgScale: 7,
    sampler: 'ddim',
    steps: 25,
    seed: undefined,
    batch: 4,
    vaeId: '',
    baseModel: '',
  });

  const handleshengtuxinxi = (resp: any) => {
    const { modelInfo = {}, queue = {}, modelVersion = {}, resourceList = [] } = resp?.result || {};
    const params = JSON.parse(queue?.params || '{}');

    setDefaultModel({
      baseModel: modelInfo.baseModel,
      versionId: modelInfo.id,
      name: modelInfo.modelTitle,
      metaImage: modelVersion.metaImage,
      versionName: modelVersion.name,
    });

    const _resources = resourceList.map((item: any) => {
      return {
        name: item.name,
        versionId: item.id,
      };
    });
    setDefaultResources(
      resourceList.map((item: any) => {
        return {
          name: item.name,
          versionId: item.id,
        };
      })
    );
    const {
      model_version: modelId,
      resources = _resources.map(({ versionId }: any) => versionId),
      prompt,
      negative_prompt: negativePrompt,
      size,
      cfg_scale: cfgScale,
      sampler,
      steps,
      seed,
      vaeId = '',
      base_model: baseModel,
    } = params;
    setModel({
      modelId: +modelId,
      resources,
      prompt,
      negativePrompt,
      size: size + '',
      cfgScale,
      sampler,
      steps,
      seed,
      batch: queue.batchNum || 1,
      vaeId,
      baseModel,
    });
    setModelKey(modelKey + 1);
  };
  // 图片生图
  useEffect(() => {
    if (!defaultImageId) return;
    ImageDetail(defaultImageId).then((resp: any) => {
      setImageId('');
      handleshengtuxinxi(resp);
      return () => setImageId('');
    });
  }, [defaultImageId]);

  const [defaultModel, setDefaultModel] = useState({});
  const [defaultResources, setDefaultResources] = useState([]);

  // 任务生图
  useEffect(() => {
    if (!defaultTaskId) return;
    taskDetail(defaultTaskId).then((resp: any) => {
      setTaskId('');
      handleshengtuxinxi(resp);
      return () => setTaskId('');
    });
  }, [defaultTaskId]);

  // 模型生图
  useEffect(() => {
    if (!defaultModelVersionId) return;

    getInfoByVersionId(defaultModelVersionId).then((resp: any) => {
      const [info] = resp?.result || [];

      const _modell: any = {
        modelId: '',
        resources: [],
        prompt: '',
        negativePrompt: '',
        size: '0',
        cfgScale: 7,
        sampler: 'ddim',
        steps: 25,
        seed: undefined,
        batch: 4,
        vaeId: '',
        baseModel: '',
      };
      if (info.type == 'Checkpoint') {
        setDefaultModel({
          name: info.name,
          baseModel: info.baseModel,
          versionId: info.versionId,
          metaImage: info.metaImage,
          versionName: info.versionName,
        });
        _modell.modelId = info.versionId;
        _modell.baseModel = info.baseModel;
      } else {
        const _resourcess: any = [
          {
            name: info.versionName,
            versionId: info.versionId,
          },
        ];
        setDefaultResources(_resourcess);
        _modell.resources = _resourcess;
      }

      setModel(_modell);

      setModelKey(modelKey + 1);
    });

    // return () => setModelVersionId('');
  }, [defaultModelVersionId]);

  useEffect(() => {
    if (isGeneratePage) {
      setView('generate');
    }
  }, [isGeneratePage]);
  const onSubmit = (result: any) => {
    draftCreate(
      Object.assign({}, result, { size: +result.size, vaeId: result.vaeId || null })
    ).then((resp: any) => {
      if (resp.code == 200) {
        onAfterGenerated();

        setModel({
          modelId: +defaultModelVersionId,
          resources: [],
          prompt: '',
          negativePrompt: '',
          size: '0',
          cfgScale: 7,
          sampler: 'ddim',
          steps: 25,
          seed: undefined,
          batch: 4,
          vaeId: '',
          baseModel: model.baseModel ?? '',
        });
        if (!isGeneratePage) {
          setView('queue');
        }
      } else {
        showNotification({
          color: 'red',
          title: 'Operation Failed',
          message: resp.message || '',
        });
      }
    });
  };

  const tabs: any = {
    generate: {
      Icon: IconBrush,
      render: () => (
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <GenerationForm
            key={modelKey}
            onClose={onClose}
            toGenerate={toGenerate}
            model={model}
            defaultModel={defaultModel}
            defaultResources={defaultResources}
            onSubmit={onSubmit}
          />
        </Box>
      ),
      label: <>Create</>,
    },
    queue: {
      Icon: IconListDetails,
      render: () => (
        <Queue
          onClose={onClose}
          toGenerate={toGenerate}
          onPost={onPost}
          onDelImage={onDelImage}
          onRedraw={onRedraw}
        />
      ),
      label: <>List</>,
    },
    feed: {
      Icon: IconSlideshow,
      render: () => (
        <Feed onClose={onClose} toGenerate={toGenerate} onPost={onPost} onDelImage={onDelImage} />
      ),
      label: <>Feed</>,
    },
  };

  const onClose = () => {
    if (isGeneratePage) {
      router.back();
    }
    close();
  };

  const toGenerate = () => {
    setView('generate');
    router.push('/generate');
  };

  const onPost = (list: any, cb: () => any) => {
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
          .then((resp: any) => {
            if (resp.code == 200) {
              showNotification({
                color: 'green',
                title: 'Successfully',
                message: 'Published successfully',
              });
            } else {
              showNotification({
                color: 'red',
                title: 'Failed',
                message: resp.message || '',
              });
            }
          })
          .finally(() => {
            cb();
          });
      },
    });
  };
  const onDelImage = (list: any, cb: () => any) => {
    openConfirmModal({
      centered: true,
      title: 'Delete',
      children: 'Are you sure to delete the image?',
      labels: { cancel: `Cancel`, confirm: `Confirm` },
      className: 'hd-confirm-model',
      onConfirm: () => {
        deleteImage({
          list,
        }).then(() => cb());
      },
    });
  };

  const onRedraw = () => {
    setView('generate');
  };

  const render = tabs[view].render;
  return (
    <>
      {render()}

      {isGeneratePage ? (
        ''
      ) : (
        <Group spacing={0} grow className={classes.tabsList}>
          <div
            style={{
              backgroundColor: '#161616',
              borderRadius: '6px',
              border: '1px solid #2D2D2D',
              height: '58px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {(Object.entries(tabs) as any).map(([key, { Icon, label }]: any, index: number) => (
              <Button
                key={index}
                data-autofocus={index === 0}
                onClick={() => setView(key as any)}
                radius={0}
                style={{
                  width: '100%',
                  height: '42px',
                  margin: index === 1 ? '0 8px' : '0',
                  background:
                    key === view ? 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)' : '#161616',
                  border: 'none',
                }}
              >
                <Stack align="center" spacing={4}>
                  {/* <Icon size={16} /> */}
                  {label}
                </Stack>
              </Button>
            ))}
          </div>
        </Group>
      )}
    </>
  );
}

const useStyles = createStyles((theme) => ({
  tabsList: {
    padding: '16px',
    // border: `1px solid #2D2D2D`,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}));
