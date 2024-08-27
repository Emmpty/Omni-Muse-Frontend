import { Group, Input, Stack, Radio, MultiSelect, createStyles } from '@mantine/core';
import { z } from 'zod';
import {
  Form,
  InputSegmentedControl,
  InputSelect,
  InputText,
  useForm,
  InputRadioGroup,
} from '~/libs/form';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import React, { useState, useEffect } from 'react';

const ruler = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty.'),
    type: z.string().trim().min(1, 'Type cannot be empty.'),
    checkpointType: z.string(),
    tags: z.array(z.string()),
    storage: z.string(),
  })
  .refine(
    (data) => {
      return !!data?.tags?.length;
    },
    {
      message: 'Please select the tags',
      path: ['tags'],
    }
  );

export function ModelUpsertForm({
  model,
  children,
  onSubmit,
}: {
  model: any;
  onSubmit: (data: any) => void;
  children: React.ReactNode | ((data: { loading: boolean }) => React.ReactNode);
}) {
  const { classes, cx } = useStyles();
  const [tags, setTags] = useState([]);
  const defaultValues = {
    name: '',
    type: 'Checkpoint',
    checkpointType: 'Trained',
    tags: [],
    storage: 'Arweave',
    ...model,
  };

  useEffect(() => {
    setTags(defaultValues.tags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const form = useForm({ schema: ruler, mode: 'onChange', defaultValues, shouldUnregister: false });
  const { isDirty, errors } = form.formState;

  const [type, storage] = form.watch(['type', 'storage']);
  const handleModelTypeChange = (value: any) => {
    switch (value) {
      case 'Checkpoint':
        form.setValue('checkpointType', 'Trained');
        break;
      default:
        form.setValue('checkpointType', '');
        break;
    }
  };

  const handleSubmit = () => {
    const _model = form.getValues();
    onSubmit(_model);
  };
  return (
    <Form form={form} onSubmit={handleSubmit} className={cx(classes.root)}>
      <ContainerGrid gutter="xl">
        <ContainerGrid.Col span={12}>
          <Stack>
            <InputText
              name="name"
              label="Name"
              placeholder="Name"
              withAsterisk
              styles={() => ({
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
            <Stack spacing={5}>
              <Group spacing="sm" grow style={{ marginBottom: '12px' }}>
                <InputSelect
                  name="type"
                  label="Type"
                  placeholder="Type"
                  data={[
                    { label: 'Checkpoint', value: 'Checkpoint' },
                    { label: 'TextualInversion', value: 'TextualInversion' },
                    { label: 'Hypernetwork', value: 'Hypernetwork' },
                    { label: 'LoRA', value: 'LoRA' },
                    { label: 'LyCORIS', value: 'LyCORIS' },
                    { label: 'Controlnet', value: 'Controlnet' },
                    { label: 'Wildcards', value: 'Wildcards' },
                  ]}
                  onChange={handleModelTypeChange}
                  withAsterisk
                  styles={() => ({
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
                {type === 'Checkpoint' && (
                  <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#9B9C9E' }}>Checkpoint Type</div>
                    <Input.Wrapper label="">
                      <InputSegmentedControl
                        name="checkpointType"
                        data={[
                          { label: 'Trained', value: 'Trained' },
                          { label: 'Merge', value: 'Merge' },
                        ]}
                        styles={() => ({
                          control: {
                            height: '38px',
                            lineHeight: '28px !important',
                          },
                          active: {
                            backgroundColor: '#9459FF',
                            height: '38px !important',
                          },
                          root: {
                            color: '#000',
                            marginTop: '10px',
                            backgroundColor: '#2B2D30',
                            border: '1px solid #373A40',
                          },
                        })}
                        fullWidth
                      />
                    </Input.Wrapper>
                  </div>
                )}
              </Group>

              <Group spacing="sm" grow>
                <MultiSelect
                  name="tags"
                  label="Tags"
                  placeholder="Tags"
                  description="Select tags for your model."
                  value={tags}
                  data={[
                    { label: 'animation games', value: 'animation games' },
                    { label: 'space architecture', value: 'space architecture' },
                    { label: 'two dimensional', value: 'two dimensional' },
                    { label: '3D', value: '3D' },
                    { label: 'boys', value: 'boys' },
                    { label: 'girls', value: 'girls' },
                    { label: 'IP image', value: 'IP image' },
                    { label: 'real life', value: 'real life' },
                    { label: 'Chinese style', value: 'Chinese style' },
                    { label: 'flat abstract', value: 'flat abstract' },
                    { label: 'clothing', value: 'clothing' },
                    { label: 'landscape', value: 'landscape' },
                    { label: 'animals', value: 'animals' },
                    { label: 'plants', value: 'plants' },
                    { label: 'photography', value: 'photography' },
                    { label: 'character enhancement', value: 'character enhancement' },
                    { label: 'painting style enhancement', value: 'painting style enhancement' },
                    { label: 'elements Enhance', value: 'elements Enhance' },
                    { label: 'screen control', value: 'screen control' },
                    { label: 'Other', value: 'Other' },
                  ]}
                  onChange={(v: string[]) => {
                    setTags(v);
                    form.setValue('tags', v);
                  }}
                  withAsterisk
                  styles={() => ({
                    label: {
                      marginBottom: '12px',
                      fontSize: '18px',
                      color: '#FFF',
                      fontWeight: 700,
                    },
                    input: {
                      minHeight: '46px',
                    },
                    description: {
                      marginBottom: '16px',
                      fontSize: '12px',
                    },
                  })}
                />
              </Group>
              {errors.tags && <Input.Error>{errors.tags.message}</Input.Error>}
              <Group spacing="sm" grow style={{ marginTop: '12px' }}>
                <InputRadioGroup
                  name="storage"
                  label="Storage location"
                  withAsterisk
                  styles={() => ({
                    label: {
                      fontSize: '12px',
                      color: '#9B9C9E',
                      marginBottom: '12px',
                    },
                  })}
                >
                  {['IPFS', 'Arweave', 'Swarm'].map((value) => (
                    <Radio
                      key={value}
                      value={value == 'IPFS' ? 'ipfs' : value}
                      label={value}
                      disabled={value !== 'IPFS'}
                      className={cx(classes.checked)}
                    />
                  ))}
                </InputRadioGroup>
              </Group>
            </Stack>
          </Stack>
        </ContainerGrid.Col>
      </ContainerGrid>
      {typeof children === 'function' ? children({ loading: false }) : children}
    </Form>
  );
}

const useStyles = createStyles(() => ({
  checked: {
    '.mantine-Radio-radio': {
      cursor: 'not-allowed',
    },
    input: {
      background: 'rgba(43, 45, 48, 0.50) !important',
      borderColor: '#2B2D30 !important',
    },
    '&[data-checked]': {
      '.mantine-Radio-radio': {
        cursor: 'pointer',
      },
      input: {
        background: '#9A5DFF !important',
        borderColor: '#7760FF !important',
      },
    },

    'label[data-disabled]': {
      color: '#fff !important',
      cursor: 'not-allowed',
    },
  },
  root: {
    '& .mantine-Select-dropdown div[data-selected=true]': {
      backgroundColor: '#9A5DFF !important',
    },
    '& .mantine-MultiSelect-values': {
      minHeight: '46px',
      // '.mantine-MultiSelect-defaultValue': {
      //   backgroundColor: '#2C2E33 !important',
      // },
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
      borderRadius: '8px',
    },
    '& .mantine-MultiSelect-input': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      borderRadius: '8px',
      '& input': {
        backgroundColor: 'transparent',
        borderRadius: '8px',
      },
    },
    '.mantine-SegmentedControl-root': {
      borderRadius: '8px',
    },
    '& .mantine-SegmentedControl-label': {
      backgroundColor: 'transparent',
    },
    '& .mantine-SegmentedControl-root': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
    },
  },
}));
