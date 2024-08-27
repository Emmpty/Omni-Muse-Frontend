import { Input, createStyles, Group, Text, Progress } from '@mantine/core';
import { IconTrash, IconFilePlus } from '@tabler/icons-react';
import { create } from 'ipfs-http-client';
import { Dropzone } from '@mantine/dropzone';
import React, { useEffect, useState } from 'react';
import { typeFiles } from '~/request/api/data-set/type';
import { UPLOAD_CHUNK_FILE_API } from '~/libs/form/upload/api.js';
import Uploader from '~/libs/form/upload/uploader';

const sliceUploader = new Uploader(UPLOAD_CHUNK_FILE_API, {
  showProgress: true,
  enableSlice: true,
});

const useStyles = createStyles(() => ({
  root: {
    '& .mantine-Dropzone-root': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      borderRadius: '8px',
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
}));

const ipfs = create({
  url: 'https://file.omnimuse.ai',
});

type paramsFileType = {
  // 分片上传的参数
  fileType: string | undefined;
  file: File;
};

type Props = {
  label: string;
  labelName?: string;
  form: any;
  files: typeFiles[];
  errors: any;
  withAsterisk?: boolean;
  isSliceUpload?: boolean;
  modeType?: string;
  onUploadProgress?: (flage: boolean) => void;
};

export default function UploadFile({
  label,
  labelName,
  form,
  files,
  errors,
  withAsterisk,
  isSliceUpload = false,
  modeType,
  onUploadProgress,
}: Props) {
  const { classes } = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const handleFiles = async (_files: File[]) => {
    setLoading(true);
    const { files = [] } = form.getValues();
    form.setValue(
      'files',
      files.concat(
        _files.map(({ name, size }: File) => ({
          name,
          size,
          hash: '',
          done: false,
          value: 0,
        }))
      )
    );
    if (!isSliceUpload) {
      // 普通上传
      try {
        for await (const result of ipfs.addAll(
          _files.map((file: File) => ({ path: file.name, content: file })),
          {
            progress,
          }
        )) {
          const { files = [] } = form.getValues();
          const f: typeFiles[] = files.map((c: typeFiles) => {
            if (c.name === result.path) {
              return {
                ...c,
                done: true,
                hash: result.cid.toString(),
              };
            }
            return c;
          });
          form.setValue(label, f);
          withAsterisk && form.trigger([label]);
          setLoading(!f.every(({ done }) => done));
        }
      } catch (error) {
        setLoading(false);
      }
    } else {
      // 切片上传
      _files.map((file: File) => {
        let fileType: string;
        if (modeType == 'Checkpoint') {
          fileType = 'Checkpoint';
        } else if (modeType == 'LoRA') {
          fileType = 'LoRA';
        } else if (modeType == 'LyCORIS') {
          fileType = 'LyCORIS';
        } else {
          fileType = '';
        }
        const paramsFile: paramsFileType = {
          fileType: fileType,
          file: file,
        };
        sliceUploader
          .upload(paramsFile)
          .onProgress(({ percentage, fileName }: { percentage: number; fileName: string }) => {
            form.setValue(
              'files',
              _files.map((c: File) => {
                if (c.name === fileName) {
                  return {
                    ...c,
                    value: percentage,
                  };
                }
                return c;
              })
            );
          })
          .onComplete(({ fileName, hash }: { fileName: string; hash: string }) => {
            // console.log('完成', fileName, hash);
            const resultFiles: any = _files.map((c: File) => {
              if (c.name === fileName) {
                return {
                  ...c,
                  done: true,
                  hash: hash,
                };
              }
              return c;
            });
            form.setValue('files', resultFiles);
            setLoading(!resultFiles.every(({ done }: any) => done));
          });
      });
    }
  };

  const onDelFile = (index: number) => {
    const { files = [] } = form.getValues();
    const newList = [...files];
    newList.splice(index, 1);
    form.setValue(label, newList);
    withAsterisk && form.trigger(label);
  };

  // ipfs 相关
  const progress: any = (bytes: number, path: string) => {
    const { files = [] } = form.getValues();
    form.setValue(
      'files',
      files.map((c: typeFiles) => {
        if (c.name === path) {
          return {
            ...c,
            value: +((bytes / c.size) * 100).toFixed(2),
          };
        }
        return c;
      })
    );
  };

  useEffect(() => {
    onUploadProgress && onUploadProgress(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <>
      <Input.Wrapper
        label={labelName ? labelName : 'Upload files'}
        withAsterisk={withAsterisk}
        className={classes.root}
        styles={() => ({
          label: {
            marginBottom: '12px',
            fontSize: '18px',
            fontWeight: 400,
            color: '#fff',
          },
        })}
      >
        <div className="text-[12px] text-[#9B9C9E] mb-[12px] mt-[-10px]">
          {files?.length || 0}/10 uploaded files
        </div>
        <Dropzone
          style={{
            border: `2px dashed ${errors[label] ? '#fa5252' : '#2B2D30'}`,
            height: '200px',
          }}
          styles={{
            root: {
              backgroundColor: 'var(--color-secondary-bg)',
            },
          }}
          accept={{
            'mime/type': ['.ckpt', '.pt', '.safetensors', '.bin', '.zip', '.yaml', '.yml'],
          }}
          loading={loading}
          onDrop={handleFiles}
          name={label}
        >
          <Group
            position="center"
            spacing="xl"
            style={{
              minHeight: 220,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-60px',
              }}
            >
              <Text size="xl" inline>
                <IconFilePlus size={50} stroke={1.5} />
              </Text>
              <Text
                size="xl"
                inline
                style={{
                  fontSize: '16px',
                  color: '#fff',
                  marginTop: '12px',
                  marginBottom: '6px',
                }}
              >
                Drop your files or click to select
              </Text>

              <Text
                size="sm"
                color="dimmed"
                inline
                mt={7}
                style={{ fontSize: '12px', color: '#9B9C9E' }}
              >
                Attach up to 10 files. Accepted file types: .ckpt, .pt, .safetensors, .bin, .zip,
                .yaml, .yml
              </Text>
            </div>
          </Group>
        </Dropzone>
        {errors[label] && <Input.Error>{errors[label].message}</Input.Error>}
      </Input.Wrapper>
      {files?.length > 0 &&
        files.map((f: typeFiles, index: number) => (
          <div key={index}>
            <Group>
              {f.done ? f.hash : f.name}
              {f.done ? (
                <IconTrash
                  size={16}
                  onClick={() => onDelFile(index)}
                  style={{
                    cursor: 'pointer',
                    color: '#e5e7eb',
                  }}
                />
              ) : (
                ''
              )}
            </Group>
            {f.done ? (
              ''
            ) : (
              <Progress
                radius="xl"
                size="lg"
                label={f.value + '%'}
                value={f.value}
                styles={{
                  bar: {
                    background: '#975EFF',
                  },
                }}
                striped
                animate
              />
            )}
          </div>
        ))}
    </>
  );
}
