import React, { useEffect, useState } from 'react';
import { Input, Button, Group, Text } from '@mantine/core';
import { IconArrowsExchange } from '@tabler/icons-react';
import { ModelPop } from './ModelPop';
import { HDImage } from '~/components/HDCard/HDImage';
export function ModelSelecter({ model = {}, onSelect, checked = false, clearC = 0 }: any) {
  const onSwap = () => {
    setOpened(true);
  };

  const [opened, setOpened] = useState(false);
  const [info, setInfo] = useState(model);

  useEffect(() => {
    if (clearC > 0) {
      setInfo({});
    }
  }, [clearC]);

  const onSubmit = (v: any) => {
    setInfo(v);
    setOpened(false);
    onSelect(v);
  };
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Input.Label
        required
        style={{
          marginBottom: '12px',
          fontSize: '12px',
          color: '#9B9C9E',
        }}
      >
        Model
      </Input.Label>
      <Input.Wrapper
        style={{
          height: info.metaImage ? '76px' : '56px',
          border: '1px solid #2B2D30',
          borderRadius: '6px',
          padding: '0 12px',
          backgroundColor: 'rgba(43, 45, 48, 0.50)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderColor: checked && !info.metaImage ? '#e03131' : '#2B2D30',
        }}
      >
        <Group
          spacing={20}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            width: '100%',
            height: '100%',
          }}
        >
          {info.metaImage ? (
            // <EdgeMedia
            //   src={info.metaImage}
            //   cid={info.metaImage}
            //   width={48}
            //   style={{
            //     height: '48px',
            //   }}
            // />

            <HDImage
              src={info.metaImage}
              hover={false}
              style={{ width: '48px', height: '48px', borderRadius: '8px' }}
            />
          ) : (
            <div
              style={{
                width: '48px !important',
                height: '48px',
                flexShrink: '0',
              }}
            ></div>
          )}

          <div
            style={{
              width: 'max-content',
              display: 'flex',
              flexDirection: 'column',
              color: '#fff',
              fontFamily: 'PingFang SC',
            }}
          >
            <div
              style={{
                maxWidth: '180px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {info.name}
            </div>
            <div
              style={{
                color: '#9B9C9E',
                maxWidth: '180px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {info.versionName}
            </div>
          </div>

          <Button
            radius="xl"
            size="sm"
            onClick={onSwap}
            compact
            style={{
              height: '32px',
              backgroundColor: 'rgba(43, 45, 48, 0.50)',
              border: '1px solid #2B2D30',
              marginLeft: 'auto',
            }}
          >
            <Group spacing={4} noWrap>
              <IconArrowsExchange size={16} />
              <Text size="sm" weight={500}>
                Swap
              </Text>
            </Group>
          </Button>
        </Group>
      </Input.Wrapper>
      <span
        style={{
          color: '#e03131',
          fontSize: '12px',
        }}
      >
        {checked && !info.metaImage && 'Please select model'}
      </span>
      <ModelPop
        type="model"
        opened={opened}
        onSubmit={onSubmit}
        versionId={info?.versionId ? [info.versionId] : []}
        onClose={() => setOpened(false)}
      />
    </div>
  );
}
