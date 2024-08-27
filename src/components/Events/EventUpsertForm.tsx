import {
  Button,
  Group,
  Stack,
  Title,
  SimpleGrid,
  Paper,
  ActionIcon,
  Input,
  Text,
  createStyles,
  Dialog,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import {
  IconCalendar,
  IconCalendarDue,
  IconExclamationMark,
  IconTrash,
  IconPhoto,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { useState, useCallback, useEffect } from 'react';
import { createdEvents, saveEvents } from '~/request/api/events';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import { BackButton } from '~/components/BackButton/BackButton';
import { Form, InputDatePicker, InputRTE, InputText, useForm } from '~/libs/form';
import { upsertEventInputSchema } from '~/server/schema/event.schema';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import dayjs from 'dayjs';
import { z } from 'zod';
import { AlertWithIcon } from '../AlertWithIcon/AlertWithIcon';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { create } from 'ipfs-http-client';
import { useUserStore } from '~/store/user.store';
import { showSuccessNotification } from '~/utils/notifications';

const formSchema = upsertEventInputSchema
  .refine((data) => data.raceStart < data.raceFinish, {
    message: 'Start date must be before expiration date',
    path: ['raceStart'],
  })
  .refine((data) => data.raceFinish > data.raceStart, {
    message: 'Expiration date must be after start date',
    path: ['raceFinish'],
  });

export function EventUpsertForm({ eventData }: { eventData?: any }) {
  const router = useRouter();
  const { classes, cx } = useStyles();
  const ipfs = create({
    url: 'https://file.omnimuse.ai',
  });
  const currentUser = useUserStore((state) => state.userInfo);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imagesError, setImagesError] = useState('');
  const [noImages, setNoImages] = useState(false);
  const [banner, setBanners] = useState<any>([]);
  const [dialogOpened, setDialogOpened] = useState(false);
  const [eventImages, setEventImages] = useState<any>([]);
  const images = [...eventImages, ...banner];

  useEffect(() => {
    if (images.length > 0) {
      setNoImages(false);
      setImagesError('');
    }
  }, [images]);

  const form = useForm({
    schema: formSchema,
    // defaultValues: {
    //   title: eventData?.title || '',
    //   content: eventData?.content || '',
    //   raceFinish: eventData ? new Date(eventData.raceFinish) : dayjs().add(7, 'day').toDate(),
    //   raceStart: eventData ? new Date(eventData.raceStart) : new Date(),
    // },
    mode: 'onChange',
  });
  useEffect(() => {
    if (eventData) {
      setEventImages(eventData.banner.split(',') || []);
      form.reset({
        title: eventData.title || '',
        content: eventData.content || '',
        raceFinish: eventData ? new Date(eventData.raceFinish) : dayjs().add(7, 'day').toDate(),
        raceStart: eventData ? new Date(eventData.raceStart) : new Date(),
      });
    }
  }, [eventData]); // 依赖项中包含 eventData，确保每次 eventData 更新时都会重新设置表单值

  // const { errors } = form.formState;

  const uploadToIPFS = async (files: any) => {
    const uploads = files.map((file: any) => ({ path: file.name, content: file }));
    const newBanners: any[] = [];
    setUploadLoading(true);
    for await (const result of ipfs.addAll(uploads)) {
      console.log('result', result);
      if (banner.includes(result.cid.toString())) {
        // 上传了相同文件
        return setDialogOpened(true);
      }
      newBanners.push(result.cid.toString());
      setBanners((prev: any) => [...prev, ...newBanners]);
    }
    setUploadLoading(false);
  };

  const handleDropImages = async (files: any) => {
    if (files.length) {
      uploadToIPFS(files);
    }
  };

  const removeImage = useCallback((url: any) => {
    setBanners((current: any) => current.filter((b: any) => b !== url));
  }, []);

  const getMinMaxDates = () => {
    const today = dayjs().startOf('day');

    return {
      minStartDate: today.startOf('day').toDate(),
      maxStartDate: today.clone().add(1, 'month').toDate(),
      minExpiresDate: today.clone().add(1, 'day').endOf('day').toDate(),
      maxExpiresDate: today.clone().add(1, 'day').add(1, 'month').endOf('day').toDate(),
    };
  };

  const { minStartDate, maxStartDate, minExpiresDate, maxExpiresDate } = getMinMaxDates();

  // const clearStorage = useFormStorage({
  //   schema: formSchema,
  //   form,
  //   timeout: 1000,
  //   key: `event_new`,
  //   watch: ({ title, content }) => ({
  //     title,
  //     content,
  //   }),
  // });

  const alreadyStarted = !!eventData && eventData.raceStart < new Date();

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const filteredImages = eventData ? [...eventImages, ...banner] : banner;

    if (!filteredImages || filteredImages.length == 0) {
      setNoImages(true);
      setImagesError('Please add at least 1 reference image to your event.');
      return;
    }

    try {
      setLoading(true);
      const param = {
        id: eventData?.idStr,
        ...data,
        banner: filteredImages.join(','),
      };
      const result = eventData?.idStr ? await saveEvents(param) : await createdEvents(param);

      showSuccessNotification({ message: 'Submitted successfully' });
      await router.push(`/user/${currentUser?.id}/events`);

      // clearStorage();
    } catch (error) {
      console.error(error);

      // Do nothing since the query event will show an error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form form={form} onSubmit={handleSubmit} className={cx(classes.root)}>
        <Stack spacing={32} className="relative">
          <Group spacing="md" noWrap>
            <BackButton url="/events" />
            <Title className={classes.title}>
              {eventData ? `Editing ${eventData.title} event` : 'Create a new event'}
            </Title>
          </Group>
          {alreadyStarted && (
            <AlertWithIcon icon={<IconExclamationMark size={20} />} iconColor="blue" size="sm">
              Please note that some fields are not editable anymore because the event has already
              started or somebody submitted an entry to it.
            </AlertWithIcon>
          )}
          <ContainerGrid gutter="xl">
            <ContainerGrid.Col>
              <Stack spacing={32}>
                <Stack spacing="xl">
                  {/* 标题 */}
                  {!alreadyStarted && (
                    <InputText
                      name="title"
                      label="Title"
                      placeholder="Event title..."
                      withAsterisk
                    />
                  )}
                  {/* 富文本编辑框 */}
                  <InputRTE
                    name="content"
                    label="About Event"
                    editorSize="xl"
                    includeControls={['heading', 'formatting', 'list', 'link', 'colors']}
                    placeholder="What kind of entries are you looking for？Why did you make this？What’s it for？Examples of the best case and worst case outputs from event"
                    withAsterisk
                    stickyToolbar
                  />
                  {/* 主图 */}
                  <Input.Wrapper
                    label="Example Images"
                    description="Please add at least 1 reference image to your event. This will be used as your cover images."
                    labelProps={{ mb: 12 }}
                    descriptionProps={{ mb: 12 }}
                    error={imagesError}
                    withAsterisk
                  >
                    <Dropzone
                      accept={['image/png', 'image/jpg', 'image/jpeg', 'image/webp']}
                      loading={uploadLoading}
                      onDrop={handleDropImages}
                      name="images"
                      style={{
                        border: `2px dashed ${noImages ? '#fa5252' : '#2B2D30'}`,
                        height: '200px',
                        width: '100%',
                      }}
                      disabled={images.length >= 9}
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
                  </Input.Wrapper>
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
                      {eventImages.map((image: any) => (
                        <Paper
                          key={image}
                          radius="sm"
                          p={0}
                          sx={{ position: 'relative', overflow: 'hidden', height: 332 }}
                          withBorder
                        >
                          <EdgeMedia
                            placeholder="empty"
                            src={image}
                            cid={image}
                            alt={undefined}
                            style={{ objectFit: 'cover', height: '100%' }}
                          />
                          <div style={{ position: 'absolute', top: 12, right: 12 }}>
                            <ActionIcon
                              variant="filled"
                              size="lg"
                              color="red"
                              onClick={() => {
                                setEventImages((current: any) =>
                                  current.filter((i: any) => i !== image)
                                );
                              }}
                            >
                              <IconTrash size={26} strokeWidth={2.5} />
                            </ActionIcon>
                          </div>
                        </Paper>
                      ))}
                      {banner
                        .slice()
                        .reverse()
                        .map((file: any) => (
                          <Paper
                            key={file}
                            radius="sm"
                            p={0}
                            sx={{ position: 'relative', overflow: 'hidden', height: 332 }}
                            withBorder
                          >
                            <>
                              <EdgeMedia
                                placeholder="empty"
                                src={file}
                                cid={file}
                                alt={undefined}
                                style={{ objectFit: 'cover', height: '100%' }}
                              />
                              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                                <ActionIcon
                                  variant="filled"
                                  size="md"
                                  color="red"
                                  onClick={() => removeImage(file)}
                                >
                                  <IconTrash size={18} />
                                </ActionIcon>
                              </div>
                            </>
                          </Paper>
                        ))}
                    </SimpleGrid>
                  )}
                  {/* 开始结束时间 */}
                  {!alreadyStarted && (
                    <Stack>
                      <Group spacing="md" grow>
                        <InputDatePicker
                          className={classes.fluid}
                          name="raceStart"
                          label="Start Date"
                          placeholder="Select a start date"
                          labelProps={{ mb: 12 }}
                          icon={<IconCalendar size={16} />}
                          withAsterisk
                          minDate={minStartDate}
                          maxDate={maxStartDate}
                          disabled={
                            (eventData &&
                              (dayjs(eventData.raceStart).isBefore(dayjs().startOf('day')) ||
                                dayjs(eventData.raceFinish).isAfter(dayjs().endOf('day')))) ||
                            false
                          }
                        />
                        <InputDatePicker
                          className={classes.fluid}
                          name="raceFinish"
                          label="Deadline"
                          placeholder="Select an end date"
                          labelProps={{ mb: 12 }}
                          icon={<IconCalendarDue size={16} />}
                          withAsterisk
                          minDate={minExpiresDate}
                          maxDate={maxExpiresDate}
                        />
                      </Group>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </ContainerGrid.Col>
          </ContainerGrid>
          <Group
            className="absolute flex justify-center left-0 bottom-[-73px] w-full py-[12px]"
            position="right"
          >
            <div className={`w-[924px] flex justify-end ${classes.submitttt}`}>
              <Button
                className="w-[130px] h-[44px] tracking-wider font-semibold border-0"
                button-type="primary"
                loading={loading}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Group>
        </Stack>
      </Form>
      <Dialog withCloseButton opened={dialogOpened} onClose={() => setDialogOpened(false)}>
        <p>The file already exists.</p>
      </Dialog>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    marginTop: '40px',
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
      lineHeight: '46px',
    },
    '& .mantine-MultiSelect-input': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      borderRadius: '8px',
      '& input': {
        backgroundColor: 'transparent',
      },
    },
    '& .mantine-SegmentedControl-label': {
      backgroundColor: 'transparent',
    },
    '& .mantine-SegmentedControl-root': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      borderRadius: '8px',
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
  },

  title: {
    [containerQuery.smallerThan('sm')]: {
      fontSize: '24px',
    },
  },
  fluid: {
    [containerQuery.smallerThan('sm')]: {
      maxWidth: '100% !important',
    },
    '& button[data-selected]': {
      backgroundColor: '#7760FF',
    },
  },
  submitttt: {
    width: '900px',
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
      top: '0px',
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
      top: '0px',
      right: '-600px',
      position: 'absolute',
    },
  },
}));
