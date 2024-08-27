import React, { useEffect, useState } from 'react';
import { Input, Button, Group, Text, Modal, SimpleGrid, Card, Select } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { HDImage } from '~/components/HDCard/HDImage';
import { CategoryTags } from '~/components/CategoryTags/CategoryTags';
import { genModellist, genResourceslist } from '~/request/api/generate';
export function ModelPop({
  versionId = [],
  type,
  onSubmit: _onSubmit,
  onClose: _onClose,
  opened: _opened = false,
}: any) {
  const [opened, setOpened] = useState(_opened);
  const [tag, setTag] = useState<any>(undefined);
  const onTab = (tag: any) => {
    setTag(tag);
    load(true, { tag });
  };

  const [timer, setTimer] = useState<any>(null);
  const onInput = (str: any) => {
    setSearch(str);
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        load(true, { modelName: str });
      }, 500)
    );
  };
  useEffect(() => {
    setOpened(_opened);
    if (_opened) {
      setSearch('');
      setTag(undefined);
      load(true, { modelName: '', tag: undefined });
      setPage(1);
    }
  }, [_opened]);

  const onSubmit = (value: any) => {
    setOpened(false);
    // TODO 提交数据
    _onSubmit(value);
  };

  const onClose = () => {
    setOpened(false);
    _onClose && _onClose();
  };

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setStatus] = useState(true);
  const [result, setResult] = useState<any[]>([]);
  const [isload, setLoaded] = useState(false);
  const load = (reload = false, props = {}) => {
    if (isLoading) return;
    if (isload) return;
    if (reload) {
      setIsLoading(true);
    } else {
      if (!hasData) return;
    }
    setLoaded(true);
    const api = type === 'model' ? genModellist : genResourceslist;
    api({
      versionId,
      modelName: search,
      tag,
      page: reload ? 1 : page,
      pageSize: 20,
      ...props,
    })
      .then((resp: any) => {
        setPage(page + 1);
        const data = (resp?.result || []).map(({ modelVersionList = [], ...props }) => ({
          ...props,
          modelVersionList,
        }));
        setResult(reload ? data : result.concat(data));
        setStatus(!!data.length);
      })
      .finally(() => {
        setIsLoading(false);
        setLoaded(false);
      });
  };

  const onScroll = (e: any) => {
    // 滚动条的总高度 el.scrollHeight
    const scrollHeight = e.target.scrollHeight;
    // 可视区的高度 el.clientHeight
    const height = e.target.clientHeight;
    // 滚动条距离顶部高度 el.scrollTop
    const scrollTop = e.target.scrollTop;

    if (scrollHeight - scrollTop - height < 200) {
      load(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={type === 'model' ? 'Add Model' : 'Add Resources'}
      size="1200px"
    >
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#2D2D2D',
          marginBottom: '12px',
        }}
      ></div>
      <Input
        icon={<IconSearch />}
        placeholder="Sezrch..."
        onInput={(e: any) => onInput(e.target?.value)}
        style={{
          margin: '20px 0 16px 0',
        }}
      />
      <CategoryTags onClick={onTab} />
      {/* 
      <div
        style={{
          marginBottom: '12px',
          color: '#9B9C9E',
        }}
      >
        6 models have been hidden due to your settings.
      </div> */}
      <div
        style={{
          height: '60vh',
          overflow: 'hidden',
          overflowY: 'scroll',
          marginTop: '16px',
        }}
        onScroll={onScroll}
      >
        <SimpleGrid cols={4} spacing="xs" verticalSpacing="xs">
          {result.map((item) => (
            <CardItem key={item.id} info={item} onSelect={onSubmit} />
          ))}
        </SimpleGrid>
      </div>
    </Modal>
  );
}

const CardItem = ({ info: { modelVersionList, ...info }, onSelect }: any) => {
  const _version = modelVersionList.at(0);
  const [selectInfo, setInfo] = useState(Object.assign(info, _version));
  const [selected, setSelected] = useState(_version.versionId);
  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder
      style={{
        height: '360px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      <Card.Section onClick={() => onSelect(selectInfo)}>
        <HDImage
          src={selectInfo.metaImage}
          style={{
            height: '260px',
            flexShrink: '0',
          }}
        />
      </Card.Section>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          flex: '1',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            marginTop: '14px',
            color: '#fff',
            fontWeight: 600,
            fontFamily: 'PingFang SC',
          }}
        >
          {info.name}
        </div>

        <Group
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            marginTop: 'auto',
          }}
        >
          {!modelVersionList.length || modelVersionList.length < 2 ? (
            <div
              style={{
                color: '#9B9C9E',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                maxWidth: '114px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={modelVersionList.length ? modelVersionList.at(0).versionName : info.name}
            >
              {modelVersionList.length ? modelVersionList.at(0).versionName : info.name}
            </div>
          ) : (
            <Select
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onChange={(vid: any) => {
                setSelected(vid);
                setInfo(
                  Object.assign(
                    {},
                    info,
                    modelVersionList.find((_: any) => _.versionId === vid) || {}
                  )
                );
              }}
              value={selected || modelVersionList.at(0).versionId}
              data={modelVersionList.map((item: any) => ({
                value: item.versionId,
                label: item.versionName || '22',
              }))}
              style={{
                width: '180px',
              }}
              styles={(theme) => ({
                input: {
                  background: '#1D1D1D',
                  borderColor: 'transparent',
                  borderRadius: '6px',
                },
              })}
            />
          )}
          <Button
            onClick={() => onSelect(selectInfo)}
            style={{ backgroundColor: '#9A5DFF', height: '32px' }}
          >
            Select
          </Button>
        </Group>
      </div>
    </Card>
  );
};
