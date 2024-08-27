import { useForm } from '~/libs/form';
import { IsClient } from '~/components/IsClient/IsClient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  InputNumber,
  InputNumberSlider,
  InputSegmentedControl,
  InputSelect,
  InputText,
  InputTextArea,
} from '~/libs/form';
import {
  Button,
  Card,
  Center,
  NumberInputProps,
  Paper,
  SliderProps,
  Stack,
  Group,
  Text,
  createStyles,
  Accordion,
  Input,
  ScrollArea,
} from '@mantine/core';
import { IconArrowsDiagonal, IconX } from '@tabler/icons-react';
import { PersistentAccordion } from '~/components/PersistentAccordion/PersistantAccordion';
import InputSeed from '~/components/ImageGeneration/GenerationForm/InputSeed';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { vaelist } from '~/request/api/model';
import { ModelSelecter } from './ModelSelecter';
import { ResourceSelecter } from './ResourceSelecter';
function GenerationFormInner({
  onClose,
  toGenerate,
  model,
  onSubmit,
  defaultModel = {},
  defaultResources = [],
}: any) {
  const { classes } = useStyles();
  const [vaeObj, setVAEObj] = useState({});
  useEffect(() => {
    vaelist().then((resp) => {
      const { all, ...data } = resp.result || {};
      setVAEObj(data);
    });
  }, []);
  const router = useRouter();
  // const isGeneratePage = router.pathname.startsWith('/generate');

  const [isGeneratePage, setisGeneratePage] = useState(false);
  useEffect(() => {
    setisGeneratePage(router.pathname.startsWith('/generate'));
  }, [router.pathname]);
  const schema = z
    .object({
      modelId: z.number().min(1, 'Name cannot be empty.'),
      resources: z.array(z.number()),
      prompt: z.string(),
      negativePrompt: z.string(),
      size: z.any(),
      cfgScale: z.any(),
      sampler: z.any(),
      steps: z.any(),
      seed: z.any(),
      batch: z.any(),
      vaeId: z.any(),
      baseModel: z.any(),
    })
    .refine(
      (data) => {
        return data.prompt?.length;
      },
      { message: 'Please enter prompt', path: ['prompt'] }
    );
  const form = useForm({
    schema,
    mode: 'onSubmit',
    shouldUnregister: false,
    defaultValues: model,
  });

  const [modelId, baseModel, prompt, negativePrompt] = form.watch([
    'modelId',
    'baseModel',
    'prompt',
    'negativePrompt',
  ]);
  const { errors } = form.formState;

  const [clearC, setClearC] = useState(0);
  const handleClearAll = () => {
    setClearC(clearC + 1);
    setChecked(false);
    form.setValue('resources', []);
    form.reset({
      modelId: 0,
      resources: [],
      prompt: '',
      negativePrompt: '',
      size: '0',
      cfgScale: 7,
      sampler: 'ddim',
      steps: 10,
      seed: undefined,
      batch: 4,
      vaeId: '',
      baseModel: '',
    });
  };
  const [checked, setChecked] = useState(false);
  const handleSubmit = async (data: any) => {
    onSubmit(form.getValues());
  };
  const handleError = async (e: unknown) => {
    setChecked(true);
  };

  return (
    <>
      <Group
        position="right"
        spacing="xs"
        sx={(theme) => ({
          position: 'relative',
          borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
          }`,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '10px 16px',
        })}
        className={classes.iconWrap}
      >
        <div className="icon-wrap">
          <IconArrowsDiagonal size={20} color="#fff" onClick={toGenerate} />
        </div>
        {isGeneratePage ? (
          ''
        ) : (
          <div className="icon-wrap">
            <IconX size={20} color="#fff" onClick={onClose} />
          </div>
        )}
      </Group>

      <Form
        form={form}
        onSubmit={handleSubmit}
        onError={handleError}
        style={{ width: '100%', position: 'relative', height: '100%' }}
        className={classes.root}
      >
        <Stack spacing={0} h="100%">
          <ScrollArea
            style={{
              height: isGeneratePage ? 'calc(100vh - 218px)' : 'calc(100vh - 296px)',
              marginBottom: '12px',
            }}
          >
            <Stack p="md" pb={0}>
              <ModelSelecter
                model={defaultModel}
                checked={checked}
                clearC={clearC}
                onSelect={(info: any) => {
                  form.setValue('modelId', info.versionId);
                  form.setValue('vaeId', '');
                  form.setValue('baseModel', info.baseModel);
                }}
              />

              <ResourceSelecter
                defaultv={defaultResources}
                clearC={clearC}
                onSelect={(v: any) => form.setValue('resources', v)}
              />

              <InputTextArea
                name="prompt"
                label="Prompt"
                placeholder="Your prompt goes here..."
                withAsterisk
                autosize
                minRows={1}
                styles={(theme) => ({
                  label: {
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#9B9C9E',
                  },
                })}
              />
              {errors.prompt ? <Input.Error></Input.Error> : ''}
              <InputTextArea
                name="negativePrompt"
                label="Negative Prompt"
                className="text_area_block"
                autosize
                minRows={1}
                styles={(theme) => ({
                  label: {
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#9B9C9E',
                  },
                })}
              />
              <Stack spacing={2}>
                <Input.Label
                  style={{
                    marginBottom: '12px',
                    marginTop: '6px',
                    fontSize: '12px',
                    color: '#9B9C9E',
                  }}
                >
                  Aspect Ratio
                </Input.Label>
                <InputSegmentedControl name="size" data={getAspectRatioControls()} />
              </Stack>

              <PersistentAccordion
                storeKey="generation-form-advanced"
                variant="contained"
                defaultValue="ccccc"
                classNames={{
                  item: classes.accordionItem,
                  control: classes.accordionControl,
                  content: classes.accordionContent,
                }}
              >
                <Accordion.Item value="3">
                  <Accordion.Control>
                    <Text
                      size="sm"
                      weight={590}
                      style={{ height: '36px', lineHeight: '36px', color: '#fff' }}
                    >
                      Advanced
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      <InputNumberSlider
                        name="cfgScale"
                        label={
                          <Group spacing={4} noWrap>
                            <Input.Label
                              style={{ marginBottom: '12px', fontSize: '12px', color: '#9B9C9E' }}
                            >
                              CFG Scale
                            </Input.Label>
                          </Group>
                        }
                        min={1}
                        max={30}
                        step={0.5}
                        precision={1}
                        sliderProps={sharedSliderProps}
                        numberProps={sharedNumberProps}
                        presets={[
                          { label: 'Creative', value: '4' },
                          { label: 'Balanced', value: '7' },
                          { label: 'Precise', value: '10' },
                        ]}
                        reverse
                        className={classes.steps}
                      />
                      <InputSelect
                        name="sampler"
                        label={
                          <Group spacing={4} noWrap>
                            <Input.Label
                              style={{ marginBottom: '12px', fontSize: '12px', color: '#9B9C9E' }}
                            >
                              Sampler
                            </Input.Label>
                          </Group>
                        }
                        data={[
                          { label: 'DDIM', value: 'ddim' },
                          { label: 'Plms', value: 'plms' },
                          { label: 'Euler a', value: 'euler_a' },
                          { label: 'DPM', value: 'dpm' },
                          { label: 'Unipc', value: 'unipc' },
                        ]}
                      />
                      <InputNumberSlider
                        name="steps"
                        label={
                          <Group spacing={4} noWrap>
                            <Input.Label
                              style={{ marginBottom: '12px', fontSize: '12px', color: '#9B9C9E' }}
                            >
                              Steps
                            </Input.Label>
                          </Group>
                        }
                        min={3}
                        max={50}
                        sliderProps={sharedSliderProps}
                        numberProps={sharedNumberProps}
                        presets={[
                          {
                            label: 'Fast',
                            value: '20',
                          },
                          {
                            label: 'Balanced',
                            value: '30',
                          },
                          {
                            label: 'High',
                            value: '40',
                          },
                        ]}
                        reverse
                        className={classes.steps}
                      />
                      <InputSeed
                        name="seed"
                        label="Seed"
                        min={1}
                        max={4294967295}
                        styles={(theme) => ({
                          label: {
                            marginBottom: '12px',
                            fontSize: '12px',
                            color: '#9B9C9E',
                          },
                          input: {
                            height: '46px',
                          },
                        })}
                      />
                      <InputSelect
                        name="vaeId"
                        label="VAE"
                        placeholder="VAE"
                        data={(((vaeObj as any)[baseModel] as any) || []).map(
                          ({ name: label, id: value }: any) => ({
                            label,
                            value,
                          })
                        )}
                        styles={(theme) => ({
                          label: {
                            marginBottom: '12px',
                            fontSize: '12px',
                            color: '#9B9C9E',
                          },
                          input: {
                            height: '46px',
                          },
                        })}
                      />
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </PersistentAccordion>
            </Stack>
          </ScrollArea>
          <Stack
            spacing={4}
            px="md"
            pt="xs"
            pb={3}
            className={classes.generationArea}
            style={{
              marginBottom: isGeneratePage ? '10px' : '0px',
            }}
          >
            <Group spacing="xs" className={classes.generateButtonContainer} noWrap>
              <Card withBorder className={classes.generateButtonQuantity} p={0}>
                <Stack spacing={0}>
                  <Text
                    size="xs"
                    color="dimmed"
                    weight={500}
                    ta="center"
                    className={classes.generateButtonQuantityText}
                  >
                    Quantity
                  </Text>
                  <InputNumber
                    name="batch"
                    min={1}
                    max={4}
                    className={classes.generateButtonQuantityInput}
                  />
                </Stack>
              </Card>
              <Button
                type="submit"
                size="lg"
                loading={false}
                className={classes.generateButtonButton}
                style={{
                  background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
                  width: '100%',
                  border: 'none',
                }}
              >
                Generate
              </Button>
              <Button onClick={handleClearAll} className={classes.generateButtonReset} px="xs">
                Clear All
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Form>
    </>
  );
}

export const GenerationForm = (args: any) => {
  return (
    <IsClient>
      <GenerationFormInner {...args} />
    </IsClient>
  );
};

const sharedSliderProps: SliderProps = {
  size: 'sm',
};

const sharedNumberProps: NumberInputProps = {
  size: 'sm',
};

const getAspectRatioControls = () => {
  return [
    {
      label: 'Square',
      width: 1024,
      height: 1024,
    },
    {
      label: 'Landscape',
      width: 1216,
      height: 832,
    },
    {
      label: 'Portrait',
      width: 832,
      height: 1216,
    },
  ].map(({ label, width, height }, index) => ({
    label: (
      <Stack spacing={2}>
        <Center>
          <Paper
            withBorder
            sx={{ borderWidth: 2, aspectRatio: `${width}/${height}`, height: 20 }}
          />
        </Center>
        <Stack spacing={0}>
          <Text size="xs">{label}</Text>
          <Text size={10} color="dimmed">{`${width}x${height}`}</Text>
        </Stack>
      </Stack>
    ),
    value: `${index}`,
  }));
};

const useStyles = createStyles((theme) => ({
  iconWrap: {
    height: '60px',
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
  root: {
    fontFamily: 'PingFang SC !important',
    // backgroundColor: 'rgba(0,0,0,0.5)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    '.mantine-Input-input.mantine-Textarea-input': {
      '&::-webkit-scrollbar': {
        width: '0px',
        height: '0px',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        background: 'red',
      },
      '&::-webkit-scrollbar-track': {
        width: '0px',
        background: 'red',
      },
    },
    '.mantine-UnstyledButton-root.mantine-Accordion-control': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
    },
    '.mantine-Input-input.mantine-Textarea-input': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
    },
    '& .mantine-Select-dropdown div[data-selected=true]': {
      backgroundColor: '#9A5DFF !important',
    },
    '& .mantine-MultiSelect-values': {
      minHeight: '46px',
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
    '& input': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      '&.mantine-NumberInput-input': {
        color: '#fff',
      },
    },
    '& .mantine-InputWrapper-label': {
      fontFamily: 'PingFang SC !important',
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
  steps: {
    '& label[data-checked=true]:hover': {
      border: '1px solid #9A5DFF',
      backgroundColor: 'rgba(43, 45, 48, 0.5) !important',
    },
    '& label[data-checked=true]': {
      border: '1px solid #9A5DFF',
      color: '#9A5DFF',
      backgroundColor: 'rgba(43, 45, 48, 0.50) !important',
    },
    '& .mantine-Slider-bar': {
      backgroundColor: '#9A5DFF !important',
    },
  },

  generationContainer: {},
  generationArea: {
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },
  generateButtonContainer: {
    width: '100%',
    height: '40px',
    backgroundColor: 'red',
    justifyContent: 'stretch',
    alignItems: 'stretch',
  },
  generateButtonQuantity: {
    width: 100,
    borderRadius: '8px',
    // borderTopRightRadius: 0,
    // borderBottomRightRadius: 0,
  },
  generateButtonQuantityText: {
    paddingRight: 25,
  },
  generateButtonQuantityInput: {
    marginTop: -20,
    input: {
      background: 'transparent',
      border: 'none',
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderTopLeftRadius: 0,
      textAlign: 'center',
      paddingRight: 25 + 12,
      paddingTop: 18,
      paddingBottom: 6,
      lineHeight: 1,
      fontWeight: 500,
      height: 'auto',
    },
  },
  generateButtonButton: {
    flex: 1,
    height: 'auto',
  },

  generateButtonReset: {
    borderRadius: '8px',
    backgroundColor: 'transparent !important',
    border: '1px solid #9A5DFF !important',
    height: 'auto',
    color: '#9A5DFF',
  },

  generateButtonRandom: {
    borderRadius: 0,
    height: 'auto',
    order: 3,
  },
  promptInputLabel: {
    display: 'inline-flex',
    gap: 4,
    marginBottom: 5,
    alignItems: 'center',
  },
  accordionItem: {
    backgroundColor: 'transparent',

    '&:first-of-type': {
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },

    '&:last-of-type': {
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
    },

    '&[data-active]': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
    },
  },
  accordionControl: {
    padding: '8px 8px 8px 12px',

    '&:hover': {
      background: 'transparent',
    },

    '&[data-active]': {
      borderRadius: '0 !important',
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },
  },
  accordionContent: {
    padding: '8px 12px 12px 12px',
    backgroundColor: 'transparent',
  },
}));
