import { Button, Group, Stack, Title, Input, createStyles, Image } from '@mantine/core';
import { BountyMode, BountyType } from '~/types/prisma/schema';
import { IconCalendar, IconCalendarDue } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import { BackButton } from '~/components/BackButton/BackButton';
import {
  Form,
  InputDatePicker,
  InputNumber,
  InputRTE,
  InputSelect,
  InputText,
  useForm,
} from '~/libs/form';
import dayjs from 'dayjs';
import { getDisplayName } from '~/utils/string-helpers';
import { constants } from '~/server/common/constants';
import { z } from 'zod';
import { getMinMaxDates } from './bounty.utils';
import { createdBounties, editBounties } from '~/request/api/bounty';
import { showErrorNotification, showSuccessNotification } from '~/utils/notifications';
import { useUserStore } from '~/store/user.store';
import { submitData, File_id } from '~/request/api/bounty/type';
import UploadFile from '~/components/Upload/UploadFile/UploadFile';
import UploadImg from '~/components/Upload/UploadImg/UploadImg';

// 不进字段验证
const noValidation = z.lazy(() => z.any());

const ruler = z
  .object({
    name: z.string().trim().min(1, 'Version name cannot be empty.'),
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
    description: z.string(),
    expiresAt: z.any(),
    startsAt: z.any(),
    type: z.string(),
    mode: z.string(),
    entryLimit: z.number(),
    unit_amount: z.number(),
    statusType: noValidation,
    details: noValidation,
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
      return data.description;
    },
    {
      message: 'please enter name',
      path: ['description'],
    }
  )
  .refine(
    (data) => {
      return data.images.length;
    },
    {
      message: 'Need to upload images',
      path: ['images'],
    }
  );

const useStyles = createStyles(() => ({
  submitttt: {
    width: '100%',
    height: '68px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    // backgroundColor: 'rgba(43, 45, 48, 0.50)',
    '::after': {
      content: '""',
      display: 'block',
      width: '100vw',
      height: '68px',
      borderTop: '1px solid #2B2D30',
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      top: '0px',
      left: '0',
      position: 'absolute',
      zIndex: -1,
    },
    '::before': {
      content: '""',
      display: 'block',
      width: '100vw',
      height: '68px',
      borderTop: '1px solid #2B2D30',
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      top: '0px',
      right: '928px',
      position: 'absolute',
      zIndex: -2,
    },
  },
  root: {
    '& .mantine-Select-dropdown div[data-selected=true]': {
      backgroundColor: '#9A5DFF !important',
    },
    '& .mantine-MultiSelect-values': {
      height: '46px',
      borderRadius: '8px',
    },
    '& .mantine-Input-input': {
      height: '46px',
      borderRadius: '8px',
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
    '& .mantine-Select-input': {
      height: '46px !important',
      borderRadius: '8px',
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
    '& .mantine-InputWrapper-error': {
      marginTop: '10px',
    },
  },
  fluid: {
    '& button[data-selected]': {
      backgroundColor: '#7760FF',
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BountyUpsertForm({ defaultValue }: { defaultValue: any }) {
  // console.log(defaultValue);
  const router = useRouter();
  const { classes, cx } = useStyles();
  const currentUser = useUserStore((state) => state.userInfo);
  const { minStartDate, maxStartDate, minExpiresDate, maxExpiresDate } = getMinMaxDates();
  const form = useForm({
    schema: ruler,
    defaultValues: {
      name: defaultValue.name ?? '',
      description: defaultValue?.description ?? '',
      unit_amount: defaultValue?.unit_amount ?? constants.bounties.minCreateAmount,
      type: defaultValue?.type ? defaultValue?.type : BountyType.Checkpoint,
      mode: defaultValue?.mode ?? BountyMode.Individual,
      entryLimit: defaultValue?.maxEntiesPerHunter ?? 1,
      files: (defaultValue?.files as any[]) ?? [],
      expiresAt: dayjs().add(7, 'day').endOf('day').toDate(),
      startsAt: new Date(),
      details: defaultValue?.details ?? { baseModel: 'SD 1.5' },
      statusType: defaultValue?.statusType,
      images: defaultValue.image_id ?? [],
    },
    shouldUnregister: false,
  });

  const type = form.watch('type');
  const files = form.watch('files');
  const images = form.watch('images');

  const requireBaseModelSelection = [BountyType.Checkpoint].some((t) => t === type);

  const alreadyStarted = defaultValue.startsAt < new Date();
  const [btnLoading, setbtnLoading] = useState<boolean>(false);
  const [btnLoading2, setbtnLoading2] = useState<boolean>(false);

  const handleSubmit = async () => {
    const performTransaction = async () => {
      try {
        const data = form.getValues();
        // const reslut: string[] = data.files.map((item) => item.hash);
        const reslut: File_id[] = data.files.map((item) => {
          return {
            filename: item.name,
            fileSize: item.size,
            fileHash: item.hash,
          };
        });

        // console.log(data);
        // console.log(reslut);
        if (!defaultValue.id) {
          // 创建赏金
          const dataParams: submitData = {
            name: data.name,
            type: data.type,
            model: data.details ? data.details.baseModel : '',
            description: data.description,
            start: data.startsAt,
            deadline: data.expiresAt,
            bountyAmount: data.unit_amount,
            maxEntiesPerHunter: data.entryLimit,
            imageHash: data.images,
            fileHash: reslut,
            statusType: data.statusType,
          };
          data.statusType == 0 ? setbtnLoading(true) : setbtnLoading2(true);
          createdBounties(JSON.stringify(dataParams)).then((res) => {
            if (res.code === 200) {
              showSuccessNotification({
                title: 'hint',
                message: res.message,
              });
              if (data.statusType == 0) {
                setTimeout(() => {
                  showSuccessNotification({
                    title: 'Redirecting...',
                    message: res.message,
                  });
                  setbtnLoading(false);
                  router.replace(`/user/${currentUser?.id}/bounties`);
                }, 1500);
              } else {
                setTimeout(() => {
                  setbtnLoading2(false);
                  router.replace(`/user/${currentUser?.id}/bounties?type=draft`);
                }, 1500);
              }
              // clearStorage();
            } else {
              setbtnLoading(false);
              setbtnLoading2(false);
              showErrorNotification({
                title: 'Kind tips',
                error: new Error(res.message),
              });
            }
          });
        } else {
          // 修改赏金
          const dataParams: submitData = {
            bountyId: defaultValue?.id,
            name: data.name,
            type: data.type,
            model: data.details ? data.details.baseModel : '',
            description: data.description,
            start: data.startsAt,
            deadline: data.expiresAt,
            bountyAmount: data.unit_amount,
            maxEntiesPerHunter: data.entryLimit,
            imageHash: data.images,
            fileHash: reslut,
            statusType: data.statusType,
          };
          data.statusType == 0 ? setbtnLoading(true) : setbtnLoading2(true);
          editBounties(JSON.stringify(dataParams)).then((res) => {
            if (res.code === 200) {
              showSuccessNotification({
                title: 'hint',
                message: res.message,
              });
              if (data.statusType == 0) {
                setTimeout(() => {
                  showSuccessNotification({
                    title: '跳转中...',
                    message: res.message,
                  });
                  setbtnLoading(false);
                  router.back();
                }, 1500);
              } else {
                setbtnLoading2(false);
              }
            } else {
              setbtnLoading(false);
              setbtnLoading2(false);
              showErrorNotification({
                title: 'Kind tips',
                error: new Error(res.message),
              });
            }
          });
        }
      } catch (error) {
        // Do nothing since the query event will show an error notification
        setbtnLoading(false);
        setbtnLoading2(false);
      }
    };

    performTransaction();
  };

  const onUploadStatus = (flage: boolean) => {
    setbtnLoading2(flage);
    setbtnLoading(flage);
  };

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

  return (
    <Form
      form={form}
      className={classes.root}
      onSubmit={handleSubmit}
      style={{ marginTop: '35px' }}
    >
      <Stack spacing={32}>
        <Group spacing="md" noWrap>
          <BackButton url="/bounties" />
          <Title>{defaultValue?.id ? `Editing bounty` : 'Create a new bounty'}</Title>
        </Group>
        <ContainerGrid gutter="xl">
          <ContainerGrid.Col>
            <Stack spacing={32}>
              <Stack spacing="xl">
                <InputText name="name" label="Name" placeholder="Bounty name..." withAsterisk />
                <Group spacing="md" grow>
                  <InputSelect
                    className={classes.fluid}
                    name="type"
                    label={
                      <Group spacing={4} noWrap>
                        <Input.Label required>Type</Input.Label>
                      </Group>
                    }
                    placeholder="Please select a bounty type"
                    data={Object.values(BountyType).map((value) => ({
                      value,
                      label: getDisplayName(value),
                    }))}
                    onChange={(value) => {
                      switch (value) {
                        case BountyType.Checkpoint:
                          form.setValue('details.baseModel', 'SD 1.5');
                          break;
                        default:
                          form.setValue('details', undefined);
                          break;
                      }
                    }}
                  />
                  {requireBaseModelSelection && (
                    <InputSelect
                      className={classes.fluid}
                      name="details.baseModel"
                      label="Base model"
                      placeholder="Please select a base model"
                      withAsterisk
                      data={[...constants.baseModels]}
                    />
                  )}
                </Group>
                <InputRTE
                  name="description"
                  label="About your bounty"
                  editorSize="xl"
                  includeControls={['heading', 'formatting', 'list', 'link', 'colors']}
                  placeholder="What kind of entries are you looking for？Why did you make this？What’s it for？Examples of the best case and worst case outputs from bounty entries"
                  withAsterisk
                  stickyToolbar
                  style={{ minHeight: '198px' }}
                />
                <UploadImg
                  label="images"
                  images={images}
                  form={form}
                  errors={errors}
                  withAsterisk={true}
                />

                {!alreadyStarted && (
                  <Stack>
                    <Group spacing="md" grow>
                      <InputDatePicker
                        className={classes.fluid}
                        name="startsAt"
                        label="Start Date"
                        placeholder="Select a start date"
                        icon={<IconCalendar size={16} />}
                        withAsterisk
                        minDate={minStartDate}
                        maxDate={maxStartDate}
                        styles={{
                          label: { marginBottom: '12px' },
                          input: {
                            backgroundColor: 'var(--color-secondary-bg)',
                          },
                        }}
                      />
                      <InputDatePicker
                        className={classes.fluid}
                        name="expiresAt"
                        label="Deadline"
                        placeholder="Select an end date"
                        icon={<IconCalendarDue size={16} />}
                        withAsterisk
                        minDate={minExpiresDate}
                        maxDate={maxExpiresDate}
                        styles={{
                          label: { marginBottom: '12px' },
                          input: {
                            backgroundColor: 'var(--color-secondary-bg)',
                          },
                        }}
                      />
                    </Group>
                  </Stack>
                )}

                <Group spacing="md" grow>
                  <InputNumber
                    className={classes.fluid}
                    name="unit_amount"
                    label="Bounty Amount"
                    placeholder="How much are you willing to reward for this bounty"
                    min={1}
                    step={1}
                    icon={<Image src={'/images/icon/gold.svg'} width={18} height={18} alt="" />}
                    withAsterisk
                  />
                  <InputNumber
                    className={classes.fluid}
                    name="entryLimit"
                    label="Max entries per hunter"
                    placeholder="How many entries can a hunter submit to your bounty"
                    min={1}
                    max={100000}
                    withAsterisk
                  />
                </Group>
                <UploadFile
                  label="files"
                  labelName="Attachments"
                  files={files}
                  form={form}
                  errors={errors}
                  onUploadProgress={onUploadStatus}
                />
              </Stack>
            </Stack>
          </ContainerGrid.Col>
        </ContainerGrid>
        <div
          style={{
            width: '100%',
            height: '68px',
            position: 'relative',
            bottom: '-100px',
            left: 0,
          }}
        >
          {/* className="max-w-[1400px] w-[900px] min-w-[500px] mx-auto flex justify-end justify-items-center" */}
          <div className={cx(classes.submitttt)}>
            <div>
              <Button
                onClick={addTDraft}
                loading={btnLoading2}
                variant="light"
                style={{ background: 'var(--color-secondary-bg)', height: '44px' }}
              >
                Add to draft
              </Button>
            </div>
            <div className="ml-[12px]">
              <Button
                type="submit"
                variant="gradient"
                loading={btnLoading}
                gradient={{ from: '#9A5DFF', to: '#7760FF', deg: 60 }}
                style={{ height: '44px' }}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Stack>
    </Form>
  );
}
