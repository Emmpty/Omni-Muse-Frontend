import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Text,
  Stack,
  Input,
  Group,
  Button,
  Container,
  Avatar,
  SimpleGrid,
  Paper,
  ActionIcon,
} from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { useModelStore } from '~/store/model.store';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import { useDialogContext } from '~/components/Dialog/DialogProvider';
import { Form, InputTextArea, InputText, useForm } from '~/libs/form';
import { z } from 'zod';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { Dropzone } from '@mantine/dropzone';
import { editUserName, uploadAvatar, getUserInfo } from '~/request/api/user/index';
import { useUserLocalStore } from '~/store/local';
import {
  showErrorNotification,
  showSuccessNotification,
  showBuzzNotification,
} from '~/utils/notifications';
import { create } from 'ipfs-http-client';
import { appealModalSubmit } from '~/request/api/model/behavior';

export default function UserProfileEdit({ modelVersionId }: { modelVersionId: number | string }) {
  const setAppealStatus = useModelStore((state) => state.setAppealStatus);
  const { setAllStoreUserInfo } = useUserLocalStore();
  const [images, setImages] = useState<any>([]);
  const [noImages, setNoImages] = useState(false);
  const [imagesError, setImagesError] = useState('');
  const dialog = useDialogContext();
  const ipfs = create({
    url: 'https://app.omnimuse.ai',
  });
  const formSchema = z.object({
    content: z.string().trim().nonempty(),
  });
  const form = useForm({
    schema: formSchema,
    mode: 'onChange',
  });

  useEffect(() => {
    if (images.length > 0) {
      setNoImages(false);
      setImagesError('');
    }
  }, [images]);

  const uploadToIPFS = async (files) => {
    const uploads = files.map((file) => ({ path: file.name, content: file }));
    const newBanners = [];
    for await (const result of ipfs.addAll(uploads)) {
      console.log('result', result);
      if (images.includes(result.cid.toString())) {
        // 上传了相同文件
        return showBuzzNotification({
          message: 'The file has been uploaded',
        });
      }
      newBanners.push(result.cid.toString());
      setImages((prev) => [...prev, ...newBanners]);
    }
  };

  const handleDropImages = async (files) => {
    if (files.length) {
      uploadToIPFS(files);
    }
  };

  const handleClose = () => {
    form.reset({
      content: '',
    });
    dialog.onClose();
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const params = {
        id: +modelVersionId,
        content: data.content,
        images: images.length > 0 ? images.join(',') : '',
      };
      const { code, result } = await appealModalSubmit(params);
      if (code == 200) {
        setAppealStatus('appeal');
        showSuccessNotification({ message: 'Appeal submitted' });
        dialog.onClose();
      }
    } catch (error) {
      showErrorNotification({
        error: new Error(error.message),
        title: 'Something went wrong. Please try again later',
      });
    }
  };

  return (
    <MantineModal
      opened={dialog.opened}
      onClose={dialog.onClose}
      title="Edit Profile"
      closeOnClickOutside={false}
      closeOnEscape={false}
      width={757}
    >
      <Container px={20}>
        <Form form={form} onSubmit={handleSubmit}>
          <ContainerGrid gutter="xl">
            <ContainerGrid.Col>
              <Stack spacing={32}>
                <Stack spacing="xl">
                  {/* 标题 */}
                  <InputTextArea
                    name="content"
                    label="Your demands"
                    placeholder="Enter content..."
                    minRows={3}
                    withAsterisk
                    autosize
                  />
                  {/* 主图 */}
                  <Input.Wrapper
                    label="Upload image"
                    descriptionProps={{ mb: 5 }}
                    error={imagesError}
                  >
                    <Group py={20} position="left">
                      <Dropzone
                        maxFiles={1}
                        accept={['image/png', 'image/jpg', 'image/jpeg', 'image/webp']}
                        onDrop={handleDropImages}
                        name="images"
                        style={{
                          border: `2px dashed ${noImages ? '#fa5252' : 'transparent'}`,
                          height: '96px',
                          width: '96px',
                        }}
                      >
                        <Group position="center" style={{ minHeight: 60, pointerEvents: 'none' }}>
                          <div className="flex items-center justify-center h-full w-full">
                            <Text className="text-[14px] text-[#9B9C9E]">
                              <IconPlus size={50} stroke={1.5} />
                            </Text>
                          </div>
                        </Group>
                      </Dropzone>
                      {images.length > 0 && (
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
                          {images.map((image) => (
                            <Paper
                              key={image}
                              radius="sm"
                              p={0}
                              sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                height: 96,
                                width: 96,
                                borderRadius: '8px',
                              }}
                              withBorder
                            >
                              <EdgeMedia
                                placeholder="empty"
                                src={image}
                                cid={image}
                                alt={undefined}
                                style={{ objectFit: 'cover', height: '96px', width: '96px' }}
                              />
                              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                                <ActionIcon
                                  variant="filled"
                                  size="lg"
                                  color="red"
                                  onClick={() => {
                                    setImages((current) => current.filter((i) => i !== image));
                                  }}
                                >
                                  <IconTrash size={26} strokeWidth={2.5} />
                                </ActionIcon>
                              </div>
                            </Paper>
                          ))}
                        </SimpleGrid>
                      )}
                    </Group>
                  </Input.Wrapper>
                </Stack>
              </Stack>
            </ContainerGrid.Col>
          </ContainerGrid>
          <Group py={20} position="right">
            <Button button-type="dark-info" className="font-semibold" onClick={handleClose}>
              Cancel
            </Button>
            <Button button-type="primary" className="font-semibold" variant="filled" type="submit">
              Submit
            </Button>
          </Group>
        </Form>
      </Container>
    </MantineModal>
  );
}
