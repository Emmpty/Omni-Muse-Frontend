import { Group, Stack, Title, createStyles, Checkbox, Button } from '@mantine/core';

import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import { BackButton } from '~/components/BackButton/BackButton';
import { Form, InputRTE, useForm } from '~/libs/form';
import { z } from 'zod';
import { BountyGetById } from '~/types/router';
import { create } from 'ipfs-http-client';
import { workAdd } from '~/request/api/bounty';
import { workAddParams } from '~/request/api/bounty/type';
import { showErrorNotification, showSuccessNotification } from '~/utils/notifications';
import { File_id } from '~/request/api/bounty/type';
import UploadFile from '~/components/Upload/UploadFile/UploadFile';
import UploadImg from '~/components/Upload/UploadImg/UploadImg';

const ruler = z
  .object({
    description: z.string().trim(),
    images: z.array(z.string()),
    files: z.array(
      z.object({
        name: z.string(),
        size: z.number(),
        hash: z.string(),
        done: z.boolean(),
        value: z.number(),
      })
    ),
  })
  .refine(
    (data) => {
      return data.images.length;
    },
    {
      message: 'Need to upload images',
      path: ['images'],
    }
  )
  .refine(
    (data) => {
      return data.files.length;
    },
    {
      message: 'Need to upload files',
      path: ['files'],
    }
  );

const useStyles = createStyles(() => ({
  submitttt: {
    width: '932px',
    height: '68px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    borderTop: '1px solid #2B2D30',
    backgroundColor: 'rgba(43, 45, 48, 0.50)',
    '::after': {
      content: '""',
      display: 'block',
      width: '600px',
      height: '68px',
      borderTop: '1px solid #2B2D30',
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      top: '-1px',
      left: '-600px',
      position: 'absolute',
    },
    '::before': {
      content: '""',
      display: 'block',
      width: '600px',
      height: '68px',
      borderTop: '1px solid #2B2D30',
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      top: '-1px',
      right: '-600px',
      position: 'absolute',
    },
    '.mantine-Checkbox-input:checked': {
      backgroundColor: '#9A5DFF !important',
      borderColor: '#9A5DFF !important',
    },
    '& button[data-disabled]': {
      opacity: '0.8',
      color: '#fff',
      // cursor: 'not-allowed',
    },
  },
  root: {
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
    '& .mantine-zxdrxe': {
      backgroundColor: '#9a5dff',
    },
    '& .mantine-InputWrapper-label': {
      marginBottom: '6px',
    },
    '& .mantine-Text-root': {
      marginBottom: '16px',
    },
    '& .mantine-Title-root': {
      marginBottom: '0',
    },
    '& .mantine-Progress-label': {
      marginBottom: '0',
    },
    '& .mantine-InputWrapper-error': {
      marginTop: '10px',
    },
  },
  checked: {
    '& input[value=true]+.mantine-vr1id': {
      backgroundColor: '#9A5DFF !important',
      borderColor: '#7760FF !important',
    },
  },
  checked2: {
    '& input[value=true]': {
      backgroundColor: '#9A5DFF !important',
      borderColor: '#7760FF !important',
    },
  },
}));

export function BountyUpsertFormCreate({ bounty }: { bounty?: BountyGetById }) {
  const router = useRouter();
  const { classes, cx } = useStyles();
  const form = useForm({
    schema: ruler,
    defaultValues: {
      description: '',
      images: [],
      files: [],
    },
    shouldUnregister: false,
  });

  const [files, images] = form.watch(['files', 'images']);
  const [checkBox, setCheckBox] = useState(false);
  const [btnLoading, setbtnLoading] = useState<boolean>(false);
  const { errors } = form.formState;

  const handleSubmit = async (data: z.infer<typeof ruler>) => {
    // console.log(data);
    const performTransaction = async () => {
      try {
        const reslut: File_id[] = [];
        data.files.map((item) => {
          const itemObjt: File_id = {
            filename: item.name,
            fileSize: item.size,
            fileHash: item.hash,
          };
          reslut.push(itemObjt);
        });

        const imgReslut: string = data.images.join(',');
        const dataParams: workAddParams = {
          bountyId: router?.query?.id || '',
          description: data.description,
          workFile: reslut,
          sampleImage: imgReslut,
        };
        console.log(dataParams);
        const res = await workAdd(dataParams);
        if (res.code === 200) {
          showSuccessNotification({
            title: 'Kind tips',
            message: 'Added successfully',
          });
          setTimeout(() => {
            window.history.back();
          }, 1500);
          // clearStorage();
        } else {
          showErrorNotification({
            title: 'Kind tips',
            error: new Error('add failed'),
          });
        }
      } catch (error) {
        // Do nothing since the query event will show an error notification
      }
    };

    performTransaction();
  };

  const toggle = (checked: boolean) => {
    setCheckBox(checked);
  };

  // 监听上传文件状态
  const onUploadStatus = (flage: boolean) => {
    setbtnLoading(flage);
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className={cx(classes.root)}>
      <Stack spacing={32}>
        <Group spacing="md" noWrap>
          <BackButton url={`/bounties/${router.query.id}`} />
          <Title style={{ marginBottom: '0' }}>
            {bounty ? `Editing ${bounty?.name} bounty` : 'Submit a new entry'}
          </Title>
        </Group>
        <ContainerGrid gutter="xl">
          <ContainerGrid.Col>
            <Stack spacing={32}>
              <Stack spacing="xl">
                <InputRTE
                  name="description"
                  label="Notes"
                  editorSize="xl"
                  description="Please describe your entry in detail. This will help participants understand what you are offering and how to use it."
                  includeControls={['heading', 'formatting', 'list', 'link', 'colors']}
                  placeholder="Notes"
                  stickyToolbar
                />
                <UploadImg
                  label="images"
                  images={images}
                  form={form}
                  errors={errors}
                  withAsterisk={true}
                  onUploadProgress={onUploadStatus}
                />
                <UploadFile
                  label="files"
                  files={files}
                  form={form}
                  errors={errors}
                  onUploadProgress={onUploadStatus}
                />
              </Stack>
            </Stack>
          </ContainerGrid.Col>
        </ContainerGrid>
        <Group
          position="right"
          style={{
            width: '100%',
            height: '0px',
            position: 'relative',
            bottom: '-100px',
            left: 0,
          }}
        >
          {/* className="max-w-[1400px] w-[900px] min-w-[500px] mx-auto flex justify-between justify-items-center" */}
          <div className={cx(classes.submitttt)}>
            <div
              style={{
                width: '100%',
              }}
            >
              <Checkbox
                style={{
                  maxWidth: '700px',
                  marginRight: 'auto',
                }}
                checked={checkBox}
                onChange={(e) => toggle(e.target.checked)}
                label="By submitting an entry you consent that in the event that you win the bounty, the creator of the bounty has ownership over your entry, and can do with it what they will."
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              loading={btnLoading}
              disabled={!checkBox}
              gradient={{ from: '#9A5DFF', to: '#7760FF' }}
              className="px-[38px]"
              style={{
                background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
                padding: '0 24px',
                height: '44px',
                color: '#fff',
              }}
            >
              Submit
            </Button>
          </div>
        </Group>
      </Stack>
    </Form>
  );
}
