import {
  Group,
  Stack,
  Input,
  Paper,
  SimpleGrid,
  Button,
  ScrollArea,
  Text,
  createStyles,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import {
  IconTrash,
  IconPlus,
  IconArrowBack,
  IconSquareRoundedArrowUp,
  IconSquareRoundedArrowDown,
  IconPhoto,
  IconChevronLeft,
} from '@tabler/icons-react';
import React, { useState, useEffect, useTransition } from 'react';
import { z } from 'zod';
import {
  Form,
  InputMultiSelect,
  InputNumber,
  InputRTE,
  InputSelect,
  InputSwitch,
  InputText,
  useForm,
  InputCheckbox,
} from '~/libs/form';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { create } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import { vaelist } from '~/request/api/model';
import { inspectImage } from './upload/index';
import UploadFile from '~/components/Upload/UploadFile/UploadFile';

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
    skipTrainedWords: z.boolean(),
    trainedWords: z.array(z.string()),
    allowDownload: z.boolean(),
    allowSell: z.boolean(),
    downloadFee: z.any(),
    sellingFee: z.any(),
    vaeId: z.any(),
    baseModel: z.any(),
    metaImage: z.string(),
    description: z.string().min(1, 'Please fill in the version description.'),
  })
  // .refine(
  //   (data) => {
  //     return data.images?.length;
  //   },
  //   { message: 'Need to upload pictures', path: ['images'] }
  // )
  .refine(
    (data) => {
      return data.files?.length;
    },
    { message: 'Need to upload files', path: ['files'] }
  )
  .refine(
    (data) => {
      if (data.skipTrainedWords) {
        return true;
      }
      return data.trainedWords?.length;
    },
    { message: 'Please enter trainedWords', path: ['trainedWords'] }
  )
  .refine(
    (data) => {
      return data.metaImage;
    },
    {
      message: 'Please upload an image with metadata made by Stable Diffusion Web UI',
      path: ['metaImage'],
    }
  );

export function ModelVersionUpsertForm({
  model,
  defaultVersions,
  onSubmit,
  onSaveDraft,
  onBack,
}: any) {
  const router = useRouter();
  if (!model.name) {
    router.replace(`/models`);
  }

  const { classes, cx } = useStyles();
  const [loading, setLoading] = useState(false);
  const [vaeObj, setVAEObj] = useState({});
  useEffect(() => {
    vaelist().then((resp) => {
      const { all, ...data } = resp.result || {};
      setVAEObj(data);
    });
  }, []);

  const ipfs = create({
    // url: 'https://app.omnimuse.ai',
    url: 'https://file.omnimuse.ai',
    // url: 'http://63.141.251.2:5001/api/v0',
  });

  const [versions, setVersions] = useState(defaultVersions);
  const [sort, setSort] = useState(0);
  const form = useForm({
    schema: ruler,
    defaultValues: defaultVersions[0],
    shouldUnregister: false,
    mode: 'onChange',
  });
  const { errors } = form.formState;

  const [
    images,
    files,
    skipTrainedWords,
    allowDownload,
    allowSell,
    trainedWords,
    baseModel,
    metaImage,
  ] = form.watch([
    'images',
    'files',
    'skipTrainedWords',
    'allowDownload',
    'allowSell',
    'trainedWords',
    'vaeId',
    'baseModel',
    'metaImage',
    'description',
  ]);

  const [metaimageloading, setMetaimageloading] = useState(false);
  const handleMetaImg = (_images: File[]) => {
    setMetaimageloading(true);
    inspectImage(_images[0]).then((_pass) => {
      if (_pass) {
        _uplo(_images);
      } else {
        setMetaimageloading(false);
        form.trigger('metaImage');
      }
    });
  };

  const _uplo = async (_images: File[]) => {
    for await (const _res of ipfs.addAll(
      _images.map((c: File) => ({ path: c.name, content: c }))
    )) {
      form.setValue('metaImage', _res.cid.toString());
      setMetaimageloading(false);
      form.trigger('metaImage');
    }
  };

  // 图片相关
  const [dropimageloading, setdropimageloading] = useState(false);
  const handleDropImages = async (_images: File[]) => {
    setdropimageloading(true);
    setLoading(true);
    for await (const result of ipfs.addAll(_images.map((c) => ({ path: c.name, content: c })))) {
      const { images = [] } = form.getValues();
      images.push(result.cid.toString());
      form.setValue('images', images);
    }
    setdropimageloading(false);
    setLoading(false);
  };

  const delImage = (_hash: string) => {
    const { images = [] } = form.getValues();
    form.setValue(
      'images',
      images.filter((hash) => hash !== _hash)
    );
  };
 
  const goBack = () => {
    const vs = Object.assign(versions, {
      [sort]: Object.assign({}, form.getValues()),
    });
    onBack(vs);
  };
  const handleSubmit = () => {
    const vs = Object.assign(versions, {
      [sort]: Object.assign({}, form.getValues()),
    });
    const v = Object.values(vs).every(({ name, baseModel, files, metaImage, description }: any) => {
      if (!name || !baseModel || !(files || []).length || !metaImage || !description) {
        return false;
      }
      return true;
    });
    if (v) {
      setVersions(vs);
      onSubmit(vs);
    }
  };

  const saveDraft = () => {
    const vs = Object.assign(versions, {
      [sort]: Object.assign({}, form.getValues()),
    });
    setVersions(vs);
    onSaveDraft(vs);
  };

  const onNew = () => {
    // 新数据
    const _def = {
      name: '',
      baseModel: 'SD 1.5',
      baseModelType: 'Standard',
      metaImage: '',
      images: [],
      description: '',
      skipTrainedWords: false,
      trainedWords: [],
      epochs: 0,
      steps: 0,
      clipSkip: 0,
      vaeId: '',
      files: [],
      allowUse: true,
      allowDownload: true,
      allowSell: true,
      downloadFee: 500,
      sellingFee: 2000,
    };
    const _v = Object.assign(versions, {
      // 复制当前数据
      [sort]: Object.assign({}, form.getValues()),
      // 添加新数据
      [Object.keys(versions).length]: Object.assign({}, _def),
    });
    // 设置高亮
    setSort(sort + 1);
    // 缓存数据
    setVersions(_v);
    // 设置表单
    form.reset(_def);
  };

  const onTab = (currentSort: number) => {
    if (+currentSort == sort) return;

    setVersions(
      Object.assign(versions, {
        // 复制当前数据
        [sort]: Object.assign({}, versions[sort], form.getValues()),
      })
    );

    // 设置高亮
    setSort(+currentSort);
    // 设置表单
    form.reset(versions[currentSort]);
    // 校验表单
    form.trigger();
  };

  const [recentlyDel, setRecentlyDel] = useState<any>(undefined);
  const onRecover = () => {
    if (!recentlyDel) return;
    const _s = Object.keys(versions).length;
    setSort(_s);
    form.reset(recentlyDel);
    setVersions(
      Object.assign({}, versions, {
        [_s]: recentlyDel,
      })
    );
    setRecentlyDel(undefined);
  };

  const onDel = () => {
    if (Object.keys(versions).length == 1) return;
    const _v = Object.entries(versions)
      .filter(([index, v]: any) => {
        if (sort == index) {
          setRecentlyDel(v);
          return false;
        }
        return true;
      })
      .reduce((rt: any, [, v], index) => {
        rt[index] = v;
        return rt;
      }, {});

    const l = Object.keys(_v).length - 1;
    setSort(l);
    setVersions(_v);
    form.reset(_v[l]);
  };

  // 增加排序数
  const onIncrease = () => {
    if (Object.keys(versions).length == 1) return;
    if (sort == Object.keys(versions).length - 1) return;
    const _v = Object.assign({}, versions[sort]);
    const __v = Object.assign({}, versions[sort + 1]);

    setSort(sort + 1);

    setVersions(
      Object.assign({}, versions, {
        [sort]: Object.assign({}, __v),
        [sort + 1]: Object.assign({}, _v),
      })
    );
  };

  // 减少排序数
  const onDecrease = () => {
    if (Object.keys(versions).length == 1) return;
    if (sort == 0) return;
    const _v = Object.assign({}, versions[sort]);
    const __v = Object.assign({}, versions[sort - 1]);
    setSort(sort - 1);
    setVersions(
      Object.assign({}, versions, {
        [sort]: Object.assign({}, __v),
        [sort - 1]: Object.assign({}, _v),
      })
    );
  };
  const [isPending, startTransition] = useTransition();
  const onNameChange = (event: any) => {
    const name = event?.target.value;
    startTransition(() => {
      setVersions(
        Object.assign(versions, {
          // 更新名字
          [sort]: Object.assign({}, versions[sort], { name }),
        })
      );
    });
  };

  return (
    <>
      <IconChevronLeft
        onClick={goBack}
        style={{
          color: '#fff',
          fontSize: '24px',
          marginRight: '12px',
          cursor: 'pointer',
          position: 'absolute',
          top: '-116px',
        }}
      />
      <Stack
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '12px',
          marginBottom: '0px',
          justifyContent: 'space-between',
        }}
      >
        <ScrollArea w={680} h={48} type="auto" offsetScrollbars>
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
            }}
          >
            {Object.entries(versions as any)
              .reverse()
              .map(([index, { name, baseModel, files, metaImage }]: any, key: number) => {
                return (
                  <Button
                    key={key}
                    variant="outline"
                    onClick={() => onTab(index)}
                    loading={loading}
                    style={{
                      border:
                        sort == index
                          ? '1px solid #9A5DFF'
                          : !name ||
                            !baseModel ||
                            // !(images || []).length ||
                            !(files || []).length ||
                            !metaImage
                          ? '1px solid #e03131'
                          : '1px solid transparent',
                      marginRight: '10px',
                      height: '36px',
                      fontSize: '14px',
                      padding: '0 22px',
                    }}
                  >
                    {name || 'New version'}
                  </Button>
                );
              })}
          </div>
        </ScrollArea>
        <Stack
          style={{ display: 'flex', flexDirection: 'row', height: '36px', alignItems: 'center' }}
        >
          {recentlyDel ? (
            <div
              style={{
                borderRadius: '8px',
                border: '1px solid #2B2D30',
                background: 'rgba(43, 45, 48, 0.50)',
                height: '34px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                color: '#FFF',
                paddingRight: '9px',
                cursor: 'pointer',
              }}
              onClick={onRecover}
            >
              <IconArrowBack size={16} style={{ margin: '0 7px' }} />

              <div
                style={{
                  color: '#FFF',
                  fontFamily: 'PingFang SC',
                  fontSize: '14px',
                }}
              >
                Return
              </div>
            </div>
          ) : (
            ''
          )}

          <div
            style={{
              borderRadius: '8px',
              border: '1px solid #2B2D30',
              background: 'rgba(43, 45, 48, 0.50)',
              height: '36px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              color: '#FFF',
              paddingRight: '9px',
              cursor: 'pointer',
            }}
            onClick={onNew}
          >
            <IconPlus size={16} style={{ margin: '0 7px' }} />
            <div
              style={{
                color: '#FFF',
                fontFamily: 'PingFang SC',
                fontSize: '14px',
              }}
            >
              Add Version
            </div>
          </div>
        </Stack>
      </Stack>

      <Form
        form={form}
        onSubmit={handleSubmit}
        style={{
          border: '1px solid #2B2D30',
          padding: '12px 24px',
          boxSizing: 'border-box',
          borderRadius: '6px',
        }}
        className={cx(classes.root)}
      >
        <div
          style={{
            position: 'absolute',
            right: '0',
            top: '-1px',
            transform: 'translate(150% )',
            border: '1px solid #2B2D30',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '14px 6px',
            background: 'rgba(43, 45, 48, 0.50)',
            alignItems: 'center',
          }}
        >
          <IconTrash onClick={onDel} size={16} style={{ cursor: 'pointer' }} />

          <div
            style={{
              width: '80%',
              height: '1px',
              backgroundColor: '#2D2D2D',
              margin: '14px 0',
            }}
          ></div>
          <IconSquareRoundedArrowUp onClick={onIncrease} size={16} style={{ cursor: 'pointer' }} />
          <div
            style={{
              width: '80%',
              height: '1px',
              backgroundColor: '#2D2D2D',
              margin: '14px 0',
            }}
          ></div>
          <IconSquareRoundedArrowDown
            onClick={onDecrease}
            size={16}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div
          className="label"
          style={{ fontSize: '24px', color: '#fff', fontWeight: 600, margin: '10px 0 20px 0' }}
        >
          Edit version
        </div>

        <Stack>
          <InputText
            name="name"
            label="Name"
            placeholder="e.g.: v1.0"
            withAsterisk
            maxLength={25}
            onInput={(v) => onNameChange(v)}
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
          <Group spacing="xs" grow style={{ marginBottom: '12px' }}>
            <InputSelect
              name="baseModel"
              label="Base Model"
              placeholder="Base Model"
              withAsterisk
              style={{ flex: 1 }}
              onChange={() => form.setValue('vaeId', '')}
              data={Object.keys(vaeObj).map((key) => ({
                label: key,
                value: key,
              }))}
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
            <InputSelect
              name="baseModelType"
              label="Base Model Type"
              placeholder="Base Model Type"
              data={[
                { label: 'Standard', value: 'Standard' },
                { label: 'Inpainting', value: 'Inpainting' },
                { label: 'Refiner', value: 'Refiner' },
                { label: 'Pix2Pix', value: 'Pix2Pix' },
              ]}
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
          </Group>
          <Stack>
            <Input.Wrapper
              label="Example Images"
              description="Please add at least 1 image to your bounty entry. This will serve as a reference point for participants and will also be used as your cover image."
              withAsterisk
              styles={() => ({
                label: {
                  marginBottom: '6px',
                  fontSize: '18px',
                  color: '#FFF',
                },
                description: {
                  marginBottom: '16px',
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
                {metaImage ? (
                  <SimpleGrid
                    spacing="sm"
                    breakpoints={[
                      { minWidth: 'xs', cols: 1 },
                      { minWidth: 'sm', cols: 1 },
                      {
                        minWidth: 'md',
                        cols: 1,
                      },
                    ]}
                    style={{ width: '346px', marginRight: '12px', flexShrink: '0' }}
                  >
                    <Paper
                      radius="sm"
                      p={0}
                      sx={{ position: 'relative', overflow: 'hidden', height: 200 }}
                      withBorder
                    >
                      <EdgeMedia
                        placeholder="empty"
                        src={metaImage}
                        cid={metaImage}
                        alt={undefined}
                        style={{ objectFit: 'cover', height: '100%' }}
                      />
                      <IconTrash
                        size={16}
                        onClick={() => {
                          form.setValue('metaImage', '');
                        }}
                        style={{
                          cursor: 'pointer',
                          color: '#e5e7eb',
                          position: 'absolute',
                          top: 12,
                          right: 12,
                        }}
                      />
                    </Paper>
                  </SimpleGrid>
                ) : (
                  <Dropzone
                    accept={['image/png', 'image/jpg', 'image/jpeg', 'image/webp']}
                    onDrop={handleMetaImg}
                    loading={metaimageloading}
                    name="images"
                    style={{
                      border: `2px dashed ${
                        metaimageloading ? '#2B2D30' : errors.metaImage ? '#fa5252' : '#2B2D30'
                      }`,
                      height: '200px',
                      width: '346px',
                      marginRight: '12px',
                      flexShrink: '0',
                    }}
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
                            fontSize: '14px',
                            color: '#fff',
                            marginTop: '12px',
                            marginBottom: '6px',
                            textAlign: 'center',
                            lineHeight: '20px',
                          }}
                        >
                          Please upload an image with metadata made by Stable Diffusion Web UI
                        </Text>

                        <Text
                          size="sm"
                          color="dimmed"
                          inline
                          mt={7}
                          style={{ fontSize: '12px', color: '#9B9C9E', textAlign: 'center' }}
                        >
                          A maximum of 1 file can be attached and the image cannot exceed 10MB
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                )}

                <Dropzone
                  accept={['image/png', 'image/jpg', 'image/jpeg', 'image/webp']}
                  onDrop={handleDropImages}
                  loading={dropimageloading}
                  name="images"
                  style={{
                    border: `2px dashed ${errors.images ? '#fa5252' : '#2B2D30'}`,
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
                          fontSize: '14px',
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
                        Attach up to 9 files，Images cannot exceed 50MB
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
              {!metaimageloading ? (
                errors.metaImage ? (
                  <Input.Error style={{ marginTop: '6px' }}>
                    Please upload image with metadata
                  </Input.Error>
                ) : errors.images ? (
                  <Input.Error>{errors.images.message}</Input.Error>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
            </Input.Wrapper>
          </Stack>
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
              {(images as any).map((hash: string) => (
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
                    onClick={() => delImage(hash)}
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

          <div>
            <div className="label" style={{ fontSize: '18px', color: '#fff', marginTop: '10px' }}>
              Version changes or notes
              <span
                className="mantine-nhis4a mantine-InputWrapper-required mantine-MultiSelect-required"
                aria-hidden="true"
              >
                {' '}
                *
              </span>
            </div>
            <div
              className="description"
              style={{ fontSize: '12px', color: '#9B9C9E', marginBottom: '16px' }}
            >
              Tell us about this version
            </div>
            <InputRTE
              key="description"
              name="description"
              label=""
              description=""
              includeControls={['formatting', 'list', 'link']}
              editorSize="xl"
              style={{ minHeight: '200px' }}
            />
          </div>
          <Stack spacing="xs">
            {!skipTrainedWords && (
              <>
                <InputMultiSelect
                  name="trainedWords"
                  label="Trigger Words"
                  placeholder="Model Tags..."
                  description={`Please input the words you have trained your model with`}
                  data={trainedWords}
                  getCreateLabel={(query) => `+ ${query}`}
                  creatable
                  clearable
                  searchable
                  required
                  styles={() => ({
                    label: {
                      fontSize: '18px',
                      color: '#fff',
                      fontWeight: 400,
                      marginBottom: '6px',
                      marginTop: '12px',
                    },
                    description: {
                      marginBottom: '16px',
                    },
                    input: {
                      height: '46px',
                    },
                  })}
                />
                {/* {errors.trainedWords && <Input.Error>{errors.trainedWords.message}</Input.Error>} */}
              </>
            )}
            <InputSwitch
              name="skipTrainedWords"
              label="This version doesn't require any trigger words"
              onChange={(e) => (e.target.checked ? form.setValue('trainedWords', []) : undefined)}
              size="xs"
              styles={() => ({
                root: {
                  marginTop: '12px',
                },
                label: {
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: '#9B9C9E',
                },
              })}
              className={cx(classes.checked)}
            />
          </Stack>
          <Stack spacing={4}>
            <div
              style={{
                color: '#FFF',
                fontSize: '18px',
                fontWeight: 400,
                marginBottom: '12px',
              }}
            >
              Training Params
            </div>

            <Group spacing="xs" grow>
              <InputNumber
                name="epochs"
                label="Epochs"
                placeholder="Training Epochs"
                min={0}
                max={100000}
                sx={{ flexGrow: 1 }}
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
              <InputNumber
                name="steps"
                label="Steps"
                placeholder="Training Steps"
                min={0}
                step={500}
                sx={{ flexGrow: 1 }}
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
            </Group>
          </Stack>
          <Stack spacing={4} style={{ marginTop: '12px' }}>
            <div
              style={{
                color: '#FFF',
                fontSize: '18px',
                fontWeight: 400,
                marginBottom: '12px',
              }}
            >
              Recommended Settings
            </div>

            <Group spacing="xs" sx={{ '&>*': { flexGrow: 1 } }}>
              <InputNumber
                name="clipSkip"
                label="Clip Skip"
                placeholder="Clip Skip"
                min={1}
                max={12}
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
              <InputSelect
                name="vaeId"
                label="VAE"
                placeholder="VAE"
                data={(((vaeObj as any)[baseModel] as any) || []).map(
                  ({ name: label, id: value }: { name: string; id: string | number }) => ({
                    label,
                    value,
                  })
                )}
                clearable
                searchable
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
            </Group>
          </Stack>

          <Stack>
            <UploadFile
              label="files"
              form={form}
              errors={errors}
              withAsterisk={true}
              files={files}
              isSliceUpload={true}
              modeType={model.type}
            />
          </Stack>
          <Stack spacing={8} style={{ marginTop: '12px' }}>
            <div
              style={{
                color: '#FFF',
                fontSize: '18px',
                fontWeight: 400,
                marginBottom: '8px',
              }}
            >
              When using this model I allow the user to:
            </div>

            <div
              style={{
                borderRadius: '8px',
                border: '1px solid #9A5DFF',
                background:
                  'linear-gradient(90deg, rgba(154, 93, 255, 0.05) 0%, rgba(119, 96, 255, 0.05) 100%)',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <InputCheckbox
                name="allowUse"
                label="Online drawing"
                styles={() => ({
                  label: {
                    fontSize: '14px',
                    color: '#fff',
                  },
                })}
                className={cx(classes.checked2)}
              />

              <Stack
                spacing={8}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '24px 0',
                  height: '36px',
                }}
              >
                <InputCheckbox
                  name="allowDownload"
                  label="Download model"
                  onChange={(e) =>
                    e.target.checked ? form.setValue('downloadFee', 500) : undefined
                  }
                  styles={() => ({
                    label: {
                      fontSize: '14px',
                      color: '#fff',
                    },
                  })}
                  className={cx(classes.checked2)}
                />
                {allowDownload ? (
                  <InputNumber
                    name="downloadFee"
                    label="Points per download"
                    min={0}
                    step={100}
                    styles={() => ({
                      root: {
                        position: 'relative',
                        width: '228px',
                      },
                      label: {
                        fontSize: '12px',
                        color: '#9B9C9E',
                        position: 'absolute',
                        top: '8px',
                        zIndex: 999,
                        left: '12px',
                      },
                      input: {
                        textAlign: 'end',
                        paddingRight: '32px',
                      },
                    })}
                  />
                ) : (
                  ''
                )}
              </Stack>
              <Stack
                spacing={8}
                style={{
                  height: '36px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <InputCheckbox
                  name="allowSell"
                  label="Model for sale"
                  styles={() => ({
                    label: {
                      fontSize: '14px',
                      color: '#fff',
                    },
                  })}
                  className={cx(classes.checked2)}
                />

                {allowSell ? (
                  <InputNumber
                    label="every sale"
                    name="sellingFee"
                    min={0}
                    step={500}
                    styles={() => ({
                      root: {
                        position: 'relative',
                        width: '228px',
                      },
                      label: {
                        fontSize: '12px',
                        color: '#9B9C9E',
                        position: 'absolute',
                        top: '8px',
                        zIndex: 999,
                        left: '12px',
                      },
                      input: {
                        textAlign: 'end',
                        paddingRight: '32px',
                      },
                    })}
                  />
                ) : (
                  ''
                )}
              </Stack>
            </div>
          </Stack>
        </Stack>

        <Group
          mt="xl"
          position="right"
          style={{
            width: '900px',
            height: '0px',
            position: 'relative',
            bottom: '-100px',
            left: 0,
          }}
        >
          <div className={cx(classes.submitttt)}>
            <Button
              variant="default"
              loading={loading}
              onClick={() => saveDraft()}
              style={{
                marginRight: '24px',
                background: 'rgba(43, 45, 48, 0.50)',
                height: '44px',
              }}
            >
              Add Draft
            </Button>
            <Button
              type="submit"
              loading={loading}
              // onClick={() => setType(0)}
              style={{
                background: 'linear-gradient(90deg, #9A5DFF 0%, #7760FF 100%)',
                height: '44px',
              }}
            >
              Submit
            </Button>
          </div>
        </Group>
      </Form>
    </>
  );
}

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
    borderTop: '1px solid #2B2D30',
    backgroundColor: 'rgba(43, 45, 48, 0.50)',
    '.mantine-UnstyledButton-root': {
      border: 'none',
    },
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
      top: '-1px',
      right: '-600px',
      position: 'absolute',
    },
  },
  root: {
    backgroundColor: 'rgba(43, 45, 48, 0.30)',
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
    },
    '& .mantine-MultiSelect-input': {
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      borderRadius: '8px',
      '& input': {
        backgroundColor: 'transparent',
        borderRadius: '8px',
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
