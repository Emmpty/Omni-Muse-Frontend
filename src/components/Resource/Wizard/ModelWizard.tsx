import {
  Button,
  Container,
  Group,
  Stack,
  Stepper,
  Title,
  createStyles,
  Center,
  Loader,
} from '@mantine/core';
import { NextRouter, useRouter } from 'next/router';
import { FilesProvider } from '~/components/Resource/FilesProvider';
import { ModelUpsertForm } from '~/components/Resource/Forms/ModelUpsertForm';
import { ModelVersionUpsertForm } from '~/components/Resource/Forms/ModelVersionUpsertForm';
import { ModelById } from '~/types/router';
import { QS } from '~/utils/qs';
import { isNumber } from '~/utils/type-guards';
import { useEffect, useState } from 'react';
import { uploadModel, getModelEditInfo } from '~/request/api/model';
import { useUserStore } from '~/store/user.store';
import { showNotification } from '@mantine/notifications';
export type ModelWithTags = Omit<ModelById, 'tagsOnModels'> & {
  tagsOnModels: Array<{ isCategory: boolean; id: number; name: string }>;
};

const CreateModel = ({
  step,
  goBack,
  router,
}: {
  step: number;
  goBack: () => void;
  router: NextRouter;
}) => {
  const { classes, cx } = useStyles();

  const [isLoading, setloading] = useState(false);
  const currentUser = useUserStore((state) => state.userInfo);

  const [model, setModel] = useState({
    name: '',
    type: 'Checkpoint',
    checkpointType: 'Trained',
    tags: [],
    storage: 'ipfs',
  });

  const [versions, setVersions] = useState({
    0: {
      name: '',
      baseModel: 'SD 1.5',
      baseModelType: 'Standard',
      metaImage: '',
      images: [],
      description: '',
      skipTrainedWords: false,
      trainedWords: [],
      epochs: 0,
      steps: 0,
      clipSkip: 0,
      vaeId: '',
      files: [],
      allowUse: true,
      allowDownload: true,
      allowSell: true,
      downloadFee: 500,
      sellingFee: 2000,
    },
  });

  useEffect(() => {
    const { id = '' } = (router.query || {}) as any;
    if (id) {
      setloading(true);
      getModelEditInfo(id)
        .then((resp: any) => {
          const { versions: defV = {}, ...defM } = resp.result || {};
          setModel(defM);
          setVersions(defV);
        })
        .finally(() => {
          setloading(false);
        });
    }
  }, [router.query]);

  const onBack = (v: any) => {
    setVersions(v);
    goBack();
  };
  const onSubmit = (v: any) => {
    const { id = '0' } = (router.query || {}) as any;
    const data = Object.assign({}, model, {
      versions: Object.values(v).map((_: any, sort) =>
        Object.assign({}, _, { sort, vaeId: _.vaeId ? _.vaeId + '' : '' })
      ),
      statusType: 0,
      modelId: id + '',
    });

    uploadModel(data).then((resp) => {
      if (resp.code == 200) {
        router.replace(`/user/${currentUser?.id}/model?type=2`);
      } else {
        showNotification({
          color: 'red',
          message: resp.message,
        });
      }
    });
  };

  const onSaveDraft = (v: any) => {
    const { id = '0' } = (router.query || {}) as any;
    const data = Object.assign({}, model, {
      versions: Object.values(v).map(({ vaeId, ..._ }: any, sort) =>
        Object.assign({}, _, { sort, vaeId: vaeId ? vaeId + '' : '' })
      ),
      statusType: 1,
      modelId: id + '',
    });
    uploadModel(data).then((resp) => {
      if (resp.code == 200) {
        showNotification({
          color: 'green',
          message: 'Join draft submission',
        });
        router.replace(`/user/${currentUser?.id}/model?type=1`);
      } else {
        showNotification({
          color: 'red',
          message: resp.message,
        });
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <Center p="xl" style={{ height: '100%' }}>
          <Loader />
        </Center>
      ) : (
        <Stepper
          active={step - 1}
          onStepClick={(step) =>
            router.replace(getWizardUrl({ step: step + 1 }, router), undefined, {
              shallow: true,
            })
          }
          allowNextStepsSelect={false}
          className={cx(classes.step)}
        >
          {/* Step 1: Model Info */}
          <Stepper.Step label={'Create your model'}>
            <Stack pos="relative">
              <Title
                order={3}
                style={{ margin: '12px 0', color: '#fff', fontWeight: '700', fontSize: '24px' }}
              >
                {'Create your model'}
              </Title>
              <ModelUpsertForm
                model={model}
                onSubmit={(values) => {
                  setModel(values);
                  // router.replace(`/models/create?step=2`);
                  router.replace(getWizardUrl({ step: 2 }, router), undefined, {
                    shallow: false,
                  });
                }}
              >
                <Group
                  style={{
                    width: '100%',
                    height: '64px',
                    borderTop: '1px solid #2B2D30',
                    backgroundColor: 'rgba(43, 45, 48, 0.50)',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                  }}
                >
                  <div
                    style={{
                      width: '928px',
                      height: '44px',
                      margin: '0 auto',
                      display: 'flex',
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <Button
                      type="submit"
                      style={{
                        background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
                        height: '44px',
                        border: 'none',
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </Group>
              </ModelUpsertForm>
            </Stack>
          </Stepper.Step>

          {/* Step 2: Version Info */}
          <Stepper.Step label={'Add version'}>
            <Stack style={{ position: 'relative' }}>
              <ModelVersionUpsertForm
                onSubmit={onSubmit}
                onBack={onBack}
                onSaveDraft={onSaveDraft}
                model={model}
                defaultVersions={versions}
              ></ModelVersionUpsertForm>
            </Stack>
          </Stepper.Step>
        </Stepper>
      )}
    </>
  );
};

function getWizardUrl({ step }: { step: number }, router: any) {
  const q = router.query || {};
  const query = QS.stringify(Object.assign(q, { step }));
  return `/models/create?${query}`;
}

const MAX_STEPS = 2;

export function ModelWizard() {
  const router = useRouter();

  const routeStep = router.query.step ? Number(router.query.step) : 1;
  const step = isNumber(routeStep) && routeStep >= 1 && routeStep <= MAX_STEPS ? routeStep : 1;

  // const goNext = () => {
  //   router.replace(getWizardUrl({ step: step + 1 }), undefined, {
  //     shallow: false,
  //   });
  // };

  const goBack = () => {
    router.replace(getWizardUrl({ step: step - 1 }, router), undefined, {
      shallow: false,
    });
  };
  return (
    <FilesProvider>
      <Container
        style={{
          width: '100vw',
          boxSizing: 'border-box',
          margin: '0 !important',
          position: 'relative',
        }}
      >
        <Stack pb="xl">
          <Group position="apart" noWrap>
            <Group spacing={8} noWrap>
              <Title
                order={2}
                style={{
                  fontSize: '30px',
                  margin: '12px 0',
                  marginTop: '24px',
                  color: '#fff',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: step === 2 ? '30px' : '0',
                }}
              >
                Publish a Model
              </Title>
            </Group>
          </Group>
          <CreateModel goBack={goBack} step={step} router={router} />
        </Stack>
      </Container>
    </FilesProvider>
  );
}

const useStyles = createStyles(() => ({
  step: {
    '& .mantine-Input-input:focus': {
      borderColor: '#9A5DFF !important',
    },
    '& input:focus': {
      borderColor: '#9A5DFF !important',
    },
    '& div[data-progress=true]': {
      borderColor: '#9A5DFF !important',
      backgroundColor: '#9A5DFF !important',
      color: '#fff',
    },
    '& div[data-completed=true]': {
      borderColor: '#9A5DFF !important',
      backgroundColor: '#9A5DFF !important',
      color: '#fff !important',
    },
    '& .mantine-Stepper-separatorActive': {
      backgroundColor: '#9A5DFF !important',
    },
  },
}));
