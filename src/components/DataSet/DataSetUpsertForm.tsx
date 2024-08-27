import { Button, Group, Stack, Title, createStyles } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import { BackButton } from '~/components/BackButton/BackButton';
import { Form, InputRTE, InputText, useForm } from '~/libs/form';
import { z } from 'zod';
import { datasetUpload, dataSetEdit } from '~/request/api/data-set';
import { showErrorNotification, showSuccessNotification } from '~/utils/notifications';
import { useUserStore } from '~/store/user.store';
import { typeFiles } from '~/request/api/data-set/type';
import { ResultDataSet } from '~/request/api/data-set/type';
import UploadFile from '~/components/Upload/UploadFile/UploadFile';

// 不进字段验证
const noValidation: any = z.lazy(() => z.any());

const ruler = z
  .object({
    name: z.string().trim(),
    note: z.string(),
    files: z.array(
      z.object({
        name: z.string(),
        size: z.number(),
        hash: z.string(),
        done: z.boolean(),
        value: z.number(),
      })
    ),
    id: noValidation,
    statusType: noValidation,
  })
  .refine(
    (data) => {
      return data.name;
    },
    {
      message: 'please enter name',
      path: ['name'],
    }
  )
  .refine(
    (data) => {
      return data.note;
    },
    {
      message: 'please enter note',
      path: ['note'],
    }
  )
  .refine(
    (data) => {
      return data.files.length;
    },
    { message: 'Need to upload files', path: ['files'] }
  );

const useStyles = createStyles(() => ({
  submitttt: {
    width: '900px',
    height: '68px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    '::after': {
      content: '""',
      display: 'block',
      width: '600px',
      height: '68px',
      borderTop: '1px solid #2B2D30',
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      top: '-1px',
      left: '-628px',
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
  },
  root: {
    marginTop: '40px',
    // backgroundColor: 'rgba(43, 45, 48, 0.30)',
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
      borderRadius: '8px',
      height: '46px',
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
      borderRadius: '8px',
    },
    '& .mantine-Dropzone-root': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      borderRadius: '8px',
    },
    '& .mantine-RichTextEditor-content,& .mantine-Group-root': {
      backgroundColor: 'transparent',
    },
    '& .mantine-zxdrxe': {
      backgroundColor: '#9a5dff',
    },
    '& .mantine-Stack-root .mantine-InputWrapper-root .mantine-InputWrapper-description': {
      marginBottom: '16px',
      marginTop: '-10px',
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

export function DataSetUpsertForm({ defaultValue }: Props) {
  const router = useRouter();
  const { classes, cx } = useStyles();
  const currentUser = useUserStore((state) => state.userInfo);
  const [btnLoading, setbtnLoading] = useState<boolean>(false);
  const [btnLoading2, setbtnLoading2] = useState<boolean>(false);

  const form = useForm({
    schema: ruler,
    defaultValues: {
      name: defaultValue.name,
      note: defaultValue.note,
      statusType: defaultValue.statusType,
      files: defaultValue.files,
      id: defaultValue.id,
    },
    shouldUnregister: false,
  });

  const [files] = form.watch(['files']);
  const { errors } = form.formState;
  const addTDraft = () => {
    form.setValue('statusType', 1);
    const { name } = form.getValues();
    if (!name) {
      showErrorNotification({
        title: 'hit',
        error: new Error('Please enter name'),
      });
      return false;
    }
    handleSubmit();
  };

  const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };

  const handleSubmit = () => {
    try {
      const data = form.getValues();
      const reslut: any[] = [];
      data.files.forEach((item: typeFiles) => {
        reslut.push({
          filename: item.name,
          fileFormat: getFileExtension(item.name),
          fileSize: item.size,
          fileHash: item.hash,
        });
      });
      if (!data.id) {
        // 创建
        const parmas: any = {
          name: data.name,
          note: data.note,
          attachment: reslut,
          statusType: data.statusType,
        };
        data.statusType == 0 ? setbtnLoading(true) : setbtnLoading2(true);
        datasetUpload(JSON.stringify(parmas)).then((res) => {
          if (res.code === 200) {
            showSuccessNotification({
              title: 'hint',
              message: res.message,
            });
            if (data.statusType === 0) {
              setTimeout(() => {
                showSuccessNotification({
                  title: 'Redirecting...',
                  message: res.message,
                });
                setbtnLoading(false);
                router.replace(`/user/${currentUser?.id}/dataSet`);
              }, 1500);
            } else {
              setTimeout(() => {
                setbtnLoading2(false);
                router.replace(`/user/${currentUser?.id}/dataSet?type=draft`);
              }, 1500);
            }
          } else {
            setbtnLoading(false);
            setbtnLoading2(false);
            showErrorNotification({
              title: 'hint',
              error: new Error(res.message),
            });
          }
        });
      } else {
        // 修改
        const parmas: any = {
          id: data.id,
          name: data.name,
          note: data.note,
          attachment: reslut,
          statusType: data.statusType,
        };
        console.log(parmas);
        data.statusType == 0 ? setbtnLoading(true) : setbtnLoading2(true);
        dataSetEdit(JSON.stringify(parmas)).then((res) => {
          if (res.code === 200) {
            if (data.statusType === 0) {
              setbtnLoading(false);
              showSuccessNotification({
                title: 'hint',
                message: res.message,
              });
              setTimeout(() => {
                router.back();
              }, 1500);
            } else {
              setbtnLoading2(false);
            }
          } else {
            setbtnLoading(false);
            showErrorNotification({
              title: 'hint',
              error: new Error(res.message),
            });
          }
        });
      }
    } catch (error) {
      setbtnLoading2(false);
      setbtnLoading(false);
    }
  };
  // 监听上传文件状态
  const onUploadStatus = (flage: boolean) => {
    setbtnLoading2(flage);
    setbtnLoading(flage);
  };

  return (
    <Form form={form} onSubmit={handleSubmit} className={classes.root}>
      <Stack spacing={32}>
        <Group spacing="md" noWrap>
          <BackButton url="/data-set" />
          <Title>{defaultValue?.id ? `Editing Data Set` : 'Publish a Data Set'}</Title>
        </Group>
        <ContainerGrid gutter="xl">
          <ContainerGrid.Col>
            <Stack spacing={32}>
              <Stack spacing="xl">
                <InputText
                  name="name"
                  label="Name"
                  withAsterisk
                  placeholder="Data Set name..."
                  description=" "
                />
              </Stack>
              <Stack spacing="xl">
                <InputRTE
                  withAsterisk
                  name="note"
                  label="Note"
                  editorSize="xl"
                  description="Please describe your entry in detail. This will help participants understand what you are offering and how to use it."
                  includeControls={['heading', 'formatting', 'list', 'link', 'colors']}
                  placeholder="Notes"
                  stickyToolbar
                  style={{
                    backgroundColor: 'var(--color-secondary-bg)',
                    strokeWidth: '1px',
                    stroke: '#2B2D30',
                    minHeight: '198px',
                  }}
                />
                <UploadFile
                  label="files"
                  files={files}
                  form={form}
                  errors={errors}
                  withAsterisk={true}
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
            height: '68px',
            position: 'relative',
            bottom: '-100px',
            left: 0,
            background: 'rgba(43, 45, 48, 0.50)',
            borderTop: '1px solid #2B2D30',
          }}
        >
          <div className={cx(classes.submitttt)}>
            <div>
              <Button
                onClick={addTDraft}
                variant="light"
                loading={btnLoading2}
                style={{ background: 'var(--color-secondary-bg)' }}
              >
                Add to draft
              </Button>
            </div>
            <div className="ml-[12px]">
              <Button
                type="submit"
                loading={btnLoading}
                variant="gradient"
                gradient={{ from: '#9A5DFF', to: '#7760FF', deg: 60 }}
              >
                Submit
              </Button>
            </div>
          </div>
        </Group>
      </Stack>
    </Form>
  );
}

type Props = { defaultValue: ResultDataSet };
