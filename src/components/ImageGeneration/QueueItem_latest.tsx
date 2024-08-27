import {
  Card,
  Stack,
  Text,
  SimpleGrid,
  Paper,
  Checkbox,
  Spoiler,
  Badge,
  Loader,
} from '@mantine/core';
import { IconTrash, IconArrowsShuffle, IconPhoto, IconPhotoX } from '@tabler/icons-react';
import { GenerationDetails } from '~/components/ImageGeneration/GenerationDetails';
import dayjs from 'dayjs';
import { HDImage } from '~/components/HDCard/HDImage';
export function QueueItem({ details, isGeneratePage, onDelItem, onRedraw, openImage }: any) {
  return (
    <>
      <Card
        withBorder
        px="xs"
        style={{
          margin: '10px 0 20px 0',
          borderRadius: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <Card.Section
          withBorder
          inheritPadding
          py="xs"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '0px' }}>
            <div
              style={{
                marginRight: '12px',
                fontSize: '14px',
                color: '#fff',
                fontFamily: 'PingFang SC',
                fontWeight: 600,
              }}
            >
              {(details?.taskList || []).length} Photos
            </div>
            {details?.CreatedAt ? (
              <Text
                size="sm"
                style={{
                  marginRight: 'auto',
                  fontSize: '12px',
                  color: '#9B9C9E',
                  lineHeight: '24px',
                }}
              >
                {dayjs(details?.CreatedAt || null).format('h:mm a')}
              </Text>
            ) : (
              ''
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', marginRight: '0px' }}>
            <IconArrowsShuffle
              size={18}
              style={{ marginRight: '6px', cursor: 'pointer', color: '#fff' }}
              onClick={() => onRedraw(details.idStr)}
            />

            <IconTrash
              size={18}
              style={{ cursor: 'pointer', color: '#fff' }}
              onClick={() => onDelItem(details.idStr)}
            />
          </div>
        </Card.Section>
        <Stack style={{ marginTop: '10px', marginBottom: '12px' }}>
          <Spoiler maxHeight={40} showLabel="Show more" hideLabel="Hide">
            <Text size="sm" style={{ color: '#9B9C9E', fontSize: '14px' }}>
              {details.params?.prompt || ''}
            </Text>
          </Spoiler>
        </Stack>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'self-start' }}>
          {details.model?.name && (
            <Badge
              size="sm"
              style={{
                maxWidth: 200,
                cursor: 'pointer',
                borderRadius: '33px !important',
                border: '1px solid #2B2D30 !important',
                background: 'rgba(43, 45, 48, 0.50) !important',
                color: '#fff !important',
              }}
            >
              {details.model?.name}
            </Badge>
          )}

          {(details.resourceList || []).map((item: any) => (
            <Badge
              key={item.id}
              size="sm"
              style={{
                maxWidth: 200,
                cursor: 'pointer',
                borderRadius: '33px !important',
                border: '1px solid #2B2D30 !important',
                background: 'rgba(43, 45, 48, 0.50) !important',
                color: '#fff !important',
              }}
            >
              {item.name}
            </Badge>
          ))}
        </div>

        <Stack py="xs" spacing={16} style={{ padding: '16px 0' }}>
          {(details?.taskList || []).length > 0 && (
            <SimpleGrid
              spacing="sm"
              breakpoints={[
                { minWidth: 'xs', cols: 1 },
                { minWidth: 'sm', cols: 2 },
                { minWidth: 'md', cols: 2 },
                { minWidth: 'lg', cols: isGeneratePage ? 4 : 2 },
                { minWidth: 'xl', cols: isGeneratePage ? 5 : 2 },
                // { minWidth: 1600, cols: isGeneratePage ? 4 : 2 },
                // { minWidth: 1700, cols: isGeneratePage ? 5 : 2 },
                // { minWidth: 1800, cols: isGeneratePage ? 5 : 2 },
                // { minWidth: 1900, cols: isGeneratePage ? 6 : 2 },
                // { minWidth: 2000, cols: isGeneratePage ? 7 : 2 },
              ]}
            >
              {((details?.taskList || []) as any).map(({ cid, idStr, status, ...xitem }: any) =>
                status > 0 ? (
                  <Paper
                    key={idStr}
                    radius="sm"
                    p={0}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight:
                        xitem.width == xitem.height ? 150 : xitem.width > xitem.height ? 100 : 200,
                      height: '100%',
                    }}
                    withBorder
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      {/* <IconPhoto /> */}
                      <Loader size={16} />
                      <div
                        style={{
                          color: '#9B9C9E',
                          fontSize: '12px',
                          marginTop: '8px',
                        }}
                      >
                        Generating
                      </div>
                    </div>
                  </Paper>
                ) : status < 0 ? (
                  <Paper
                    key={idStr}
                    radius="sm"
                    p={0}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      height: '100%',
                      width: 'unset',
                    }}
                    withBorder
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <IconPhotoX />
                      <div
                        style={{
                          color: '#9B9C9E',
                          fontSize: '12px',
                          marginTop: '8px',
                        }}
                      >
                        Build failed
                      </div>
                    </div>
                  </Paper>
                ) : (
                  <Paper
                    key={idStr}
                    radius="sm"
                    p={0}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      height: isGeneratePage
                        ? 260
                        : xitem.width == xitem.height
                        ? 150
                        : xitem.width > xitem.height
                        ? 100
                        : 200,
                    }}
                    withBorder
                  >
                    <HDImage
                      src={cid}
                      onClick={() => {
                        openImage(cid, xitem.width, xitem.height);
                      }}
                    />
                    <Checkbox value={idStr} style={{ position: 'absolute', top: 12, left: 12 }} />
                  </Paper>
                )
              )}
            </SimpleGrid>
          )}
        </Stack>
        <Card.Section withBorder style={{}}>
          <GenerationDetails
            label="Additional Details"
            params={details.info as any}
            labelWidth={150}
            paperProps={{ radius: 0, sx: { borderWidth: '1px 0 0 0' } }}
          />
        </Card.Section>
      </Card>
    </>
  );
}
