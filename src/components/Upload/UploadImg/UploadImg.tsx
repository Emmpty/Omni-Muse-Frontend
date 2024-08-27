import { Input, createStyles, Group, Text, Paper, SimpleGrid } from '@mantine/core';
import { IconTrash, IconPhoto } from '@tabler/icons-react';
import { create } from 'ipfs-http-client';
import { Dropzone } from '@mantine/dropzone';
import React, { useState, useEffect } from 'react';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';

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

type Props = {
  label: string;
  labelName?: string;
  form: any;
  images: string[];
  errors: any;
  withAsterisk?: boolean;
  onUploadProgress?: (flage: boolean) => void;
};

export default function UploadImg({
  label,
  labelName,
  form,
  images,
  errors,
  withAsterisk,
  onUploadProgress,
}: Props) {
  const { classes } = useStyles();
  const [imgLoading, setImgLoading] = useState<boolean>(false);
  // 图片上传
  const handleDropImages = async (_images: File[]) => {
    setImgLoading(true);
    try {
      for await (const result of ipfs.addAll(_images.map((c) => ({ path: c.name, content: c })))) {
        const { images = [] } = form.getValues();
        images.push(result.cid.toString());
        form.setValue(label, images);
        withAsterisk && form.trigger(label);
        setImgLoading(false);
      }
    } catch (error) {
      setImgLoading(false);
    }
  };

  const delImage = (index: number) => {
    const { images = [] } = form.getValues();
    const imgList = [...images];
    imgList.splice(index, 1);
    form.setValue(label, imgList);
    withAsterisk && form.trigger(label);
  };

  useEffect(() => {
    onUploadProgress && onUploadProgress(imgLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgLoading]);

  return (
    <>
      <Input.Wrapper
        label={labelName ? labelName : 'Example Images'}
        description="Please add at least 1 image to your bounty entry. This will serve as a reference point for participants and will also be used as your cover image."
        withAsterisk={withAsterisk}
        className={classes.root}
        styles={() => ({
          label: {
            marginBottom: '6px',
            fontSize: '18px',
            color: '#FFF',
          },
          description: {
            marginBottom: '12px',
            fontSize: '12px',
          },
        })}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Dropzone
            accept={['image/png', 'image/jpg', 'image/jpeg', 'image/webp']}
            onDrop={handleDropImages}
            loading={imgLoading}
            name={label}
            style={{
              border: `2px dashed ${errors[label] ? '#fa5252' : '#2B2D30'}`,
              width: '100%',
            }}
            styles={{
              root: {
                backgroundColor: 'var(--color-secondary-bg)',
              },
            }}
            disabled={images?.length >= 9}
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
                }}
              >
                <Text size="xl" inline>
                  <IconPhoto size={50} stroke={1.5} />
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
                  Drag and drop images here or click to browse
                </Text>

                <Text
                  size="sm"
                  color="dimmed"
                  inline
                  mt={7}
                  style={{ fontSize: '12px', color: '#9B9C9E' }}
                >
                  Attach up to 10 files，Images cannot exceed 50MB
                </Text>
                <Text
                  size="sm"
                  color="dimmed"
                  inline
                  mt={7}
                  style={{ fontSize: '12px', color: '#9B9C9E' }}
                >
                  Accepted file types：.png，.jepg，.webp，.jpg
                </Text>

                <Text
                  size="sm"
                  color="dimmed"
                  inline
                  mt={7}
                  style={{ fontSize: '12px', color: '#9B9C9E' }}
                >
                  Videos cannot exceed 4k resolution or 120 seconds in duration
                </Text>
              </div>
            </Group>
          </Dropzone>
        </div>
        {errors[label] && <Input.Error>{errors[label].message}</Input.Error>}
      </Input.Wrapper>
      {images?.length > 0 && (
        <SimpleGrid
          spacing="sm"
          breakpoints={[
            { minWidth: 'xs', cols: 1 },
            { minWidth: 'sm', cols: 3 },
            {
              minWidth: 'md',
              cols: images.length > 3 ? 4 : images.length,
            },
          ]}
        >
          {images.map((hash: string, index: number) => (
            <Paper
              key={hash}
              radius="sm"
              p={0}
              sx={{ position: 'relative', overflow: 'hidden', height: 332 }}
              withBorder
            >
              <EdgeMedia
                placeholder="empty"
                src={hash}
                cid={hash}
                alt={undefined}
                style={{ objectFit: 'cover', height: '100%' }}
              />
              <IconTrash
                size={16}
                onClick={() => delImage(index)}
                style={{
                  cursor: 'pointer',
                  color: '#e5e7eb',
                  position: 'absolute',
                  top: 12,
                  right: 12,
                }}
              />
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
