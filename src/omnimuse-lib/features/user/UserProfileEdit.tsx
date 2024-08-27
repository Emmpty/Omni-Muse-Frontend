import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Text, Stack, Input, Group, Button, Container, Avatar } from '@mantine/core';
import { useUserStore, TUserProps } from '~/store/user.store';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import { useDialogContext } from '~/components/Dialog/DialogProvider';
import { Form, InputText, useForm } from '~/libs/form';
import { z } from 'zod';
import { Dropzone } from '@mantine/dropzone';
import { editUserName, uploadAvatar, getUserInfo } from '~/request/api/user/index';
import { useUserInfo } from '~/omnimuse-lib/hooks/user/useUserInfo';
import imageCompression from 'browser-image-compression';
import { showErrorNotification, showSuccessNotification } from '~/utils/notifications';

export default function UserProfileEdit() {
  const currentUser = useUserStore((state) => state.userInfo);
  const { setAllStoreUserInfo } = useUserInfo();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string>(currentUser?.image || '');
  const [imagesError, setImagesError] = useState('');
  const [uploading, setUploading] = useState(false);

  const dialog = useDialogContext();

  const formSchema = z.object({
    username: z.string().trim().nonempty(),
    image: z.string().trim().nonempty(),
  });
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      username: currentUser?.username || '',
      image: currentUser?.image || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (currentUser) {
      form.setValue('username', currentUser.username);
      form.setValue('image', currentUser?.image || '');
    }
  }, [currentUser]); // 依赖于 currentUser 和 form 的变化

  const handleDropImages = async (files: File[]) => {
    if (files.length) {
      const file = files[0];
      setUploading(true);
      try {
        const options = {
          maxSizeMB: 0.8, // 最大文件大小（单位：MB）
          maxWidthOrHeight: 1920, // 图片最大宽度或高度
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options); // 压缩文件
        setSelectedFile(compressedFile); // 保存压缩后的文件
        const url = URL.createObjectURL(compressedFile);
        setAvatar(url); // 更新本地预览
        form.setValue('image', url || '');
        setImagesError(''); // 清除错误信息
      } catch (error) {
        console.error('Error compressing image:', error);
        setImagesError('Error during compression');
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = useCallback(() => {
    setAvatar('');
  }, []);

  const handleClose = () => {
    form.reset();
    dialog.onClose();
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await editUserName(data.username);
      if (selectedFile) {
        await uploadAvatar(selectedFile);
      }

      const { code, result } = await getUserInfo();
      if (code == 200) {
        const info = { username: result.username, image: result.image };
        setAllStoreUserInfo(info);
        showSuccessNotification({ message: 'User profile updated' });
        dialog.onClose();
      }
    } catch (error: any) {
      showErrorNotification({
        error: new Error(error.message),
        title: 'Could not save the change',
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
      <Container px={20} pt={20}>
        <Form form={form} onSubmit={handleSubmit}>
          <ContainerGrid gutter="xl">
            <ContainerGrid.Col>
              <Stack spacing={32}>
                <Stack spacing="xl">
                  {/* 标题 */}
                  <InputText name="username" label="Preview" placeholder="User Name" withAsterisk />
                  {/* 主图 */}
                  {/* description=""
                  descriptionProps={{ mb: 5, mt: 2 }} */}
                  <Input.Wrapper label="Edit profile image" error={imagesError} withAsterisk>
                    <Group py={20} position="apart">
                      <Avatar size={100} src={avatar} />
                      <Dropzone
                        maxFiles={1}
                        loading={uploading}
                        accept={['image/png', 'image/jpg', 'image/jpeg', 'image/webp']}
                        onDrop={handleDropImages}
                        name="images"
                        style={{
                          border: `2px dashed ${!avatar ? '#fa5252' : 'transparent'}`,
                          height: '100px',
                          flex: 1,
                        }}
                      >
                        <Group position="center" style={{ minHeight: 60, pointerEvents: 'none' }}>
                          <div className="flex items-center justify-center h-full w-full">
                            <Text className="text-[14px] text-[#9B9C9E]">
                              Drop image here, should not exceed 5 MB
                            </Text>
                          </div>
                        </Group>
                      </Dropzone>
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
            <Button
              loading={uploading}
              button-type="primary"
              className="font-semibold"
              variant="filled"
              type="submit"
            >
              Save Change
            </Button>
          </Group>
        </Form>
      </Container>
    </MantineModal>
  );
}
