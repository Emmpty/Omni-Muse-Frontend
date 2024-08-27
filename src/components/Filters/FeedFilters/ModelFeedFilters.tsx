import { Group, Menu, Button, createStyles, Popover, Chip, ScrollArea } from '@mantine/core';
import { IconCheck, IconChevronDown, IconSortDescending, IconFilter } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { useModelStore111 } from '../../../pages/models/index';

export function ModelFeedFilters() {
  const { classes } = useStyles();
  const reload = useModelStore111((state: any) => state.reload);
  // 排序相关
  const [sort, setSort] = useState('Most Bookmarks');
  const [opens, setOpens] = useState(false);
  const handleSort = (value: string) => {
    setSort(value);
    emitLoad({
      sort: value,
    });
  };
  const sortItems = [
    {
      label: 'Most Reactions',
      value: 'Reactions',
    },
    {
      label: 'Most Liked',
      value: 'Liked',
    },
    {
      label: 'Most Download',
      value: 'Download',
    },
    {
      label: 'Most Collected',
      value: 'Collected',
    },
    {
      label: 'Most Discussed',
      value: 'Discussed',
    },
    {
      label: 'Oldest',
      value: 'Oldest',
    },
    {
      label: 'Newest',
      value: 'Newest',
    },
  ];

  // 过滤相关
  const filterItems = [
    {
      label: 'Time period',
      key: 'TimePeriod',
      multiple: false,
      items: ['Day', 'Week', 'Month', 'Year', 'All Time'],
    },
    {
      label: 'Model types',
      key: 'ModelTypes',
      multiple: true,
      items: [
        'Checkpoint',
        'TextualInversion',
        'Hypernetwork',
        'LoRA',
        'LyCORIS',
        'Controlnet',
        'Wildcards',
      ],
    },
    {
      label: 'Model status',
      key: 'ModelStatus',
      multiple: true,
      items: ['SD 1.5', 'SD 2.1', 'SDXL'],
    },

    // {
    //   label: 'Checkpoint type',
    //   key: 'CheckpointType',
    //   multiple: false,
    //   items: ['All', 'Trained', 'Merge'],
    // },
    // {
    //   label: 'File format',
    //   key: 'FileFormat',
    //   multiple: true,
    //   items: ['SafeTensor', 'PickleTensor', 'Diffusers', 'Core ML', 'ONNX'],
    // },
    // {
    //   label: 'Base model',
    //   key: 'BaseModel',
    //   multiple: true,
    //   items: ['ODOR', 'SD 1.4', 'SD 1.5', 'SD 1.5 LCM', 'SD 2.0', 'SD 2.1'],
    // },
    // {
    //   label: 'Modifiers',
    //   key: 'Modifiers',
    //   multiple: true,
    //   items: ['Followed Only', 'Hidden', 'Include Archived'],
    // },
  ];
  const [openf, setOpenf] = useState(false);
  const [filter, setFilter] = useState<any>({
    TimePeriod: ['All Time'],
    // ModelStatus: ['Made On-Site'],
    // CheckpointType: ['All'],
  });

  const [timer, setTimer] = useState<any>(null);
  const onCheckFilter = (key: string, value: string, multiple: boolean) => {
    const checks: any = filter[key] || [];
    const isDel = checks.includes(value);
    const newb: any = {
      [key]: [],
    };
    if (isDel) {
      if (multiple) {
        newb[key] = checks.filter((v: any) => v !== value);
        setFilter(Object.assign({}, filter, newb));
      }
    } else {
      if (multiple) {
        newb[key] = checks.concat([value]);
        setFilter(Object.assign({}, filter, newb));
      } else {
        newb[key] = [value];
        setFilter(Object.assign({}, filter, newb));
      }
    }

    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        emitLoad({
          filter: Object.assign({}, filter, newb),
        });
      }, 1500)
    );
  };

  const onClear = () => {
    const defaultV = {
      TimePeriod: ['All Time'],
      // ModelStatus: ['Made On-Site'],
      // CheckpointType: ['All'],
    };
    setFilter(defaultV);
    emitLoad({
      filter: defaultV,
    });
  };

  const emitLoad = (data: any) => {
    reload(Object.assign(data, { page: 1 }));
  };
  return (
    <Group spacing={4} noWrap>
      {/* 排序 */}
      <Menu opened={opens} onOpen={() => setOpens(true)} onClose={() => setOpens(false)}>
        <Menu.Target>
          <div
            // variant="default"
            style={{
              width: '200px',
              height: '36px',
              borderRadius: '6px',
              border: '1px solid #2B2D30',
              background: ' rgba(43, 45, 48, 0.50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              cursor: 'pointer',
              marginRight: '12px',
            }}
          >
            {/* <IconSortDescending
              size={16}
              style={{
                marginRight: '2px',
              }}
            /> */}
            <div style={{ fontSize: '14px', color: '#fff' }}> {sort}</div>
            <IconChevronDown
              size={16}
              style={{
                marginLeft: '8px',
              }}
              className={opens ? `${classes.downnnn} open` : classes.downnnn}
            />
          </div>
        </Menu.Target>
        <Menu.Dropdown p={8}>
          {sortItems.map((item) => (
            <Menu.Item key={item.value} onClick={() => handleSort(item.label)}>
              <div
                style={{
                  width: '160px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                {item.label}
                {sort === item.label ? (
                  <IconCheck
                    size={16}
                    color="#9A5DFF "
                    style={{
                      marginLeft: '12px',
                    }}
                  />
                ) : (
                  ''
                )}
              </div>
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      {/* 过滤 */}
      <Popover
        zIndex={200}
        position="bottom-end"
        shadow="md"
        opened={openf}
        onClose={() => setOpenf(false)}
        middlewares={{ flip: true, shift: true }}
        withinPortal
      >
        <Popover.Target>
          <div
            style={{
              height: '36px',
              borderRadius: '6px',
              border: '1px solid #2B2D30',
              background: ' rgba(43, 45, 48, 0.50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              cursor: 'pointer',
            }}
            onClick={() => setOpenf(!openf)}
          >
            {/* <IconSortDescending
              size={16}
              style={{
                
                inRight: '2px',
              }}
            />
            <div style={{ fontSize: '14px', color: '#fff' }}> {sort}</div> */}
            <IconFilter
              size={16}
              // className={openf ? `${classes.downnnn} open` : classes.downnnn}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown
          maw={600}
          p="md"
          w="100%"
          style={{
            borderRadius: '8px',
            background: '#161718',
            paddingBottom: '4px',
          }}
        >
          <ScrollArea.Autosize
            maxHeight={350}
            w={560}
            type="auto"
            offsetScrollbars
            style={{
              paddingBottom: 0,
            }}
          >
            {filterItems.map((group, index) => (
              <div key={group.key}>
                {/* <Divider my="xs" label={group.label} /> */}

                <div
                  style={{
                    color: '#FFF',
                    fontSize: '14px',
                    fontWeight: 400,
                    marginBottom: '12px',
                    marginTop: index ? '18px' : '0',
                  }}
                >
                  {group.label}
                </div>

                <Chip.Group
                  multiple={group.multiple}
                  value={filter[group.key] || []}
                  position="left"
                  className={classes.root}
                >
                  {group.items.map((value) => (
                    <Chip
                      key={value}
                      className={classes.chip}
                      value={value}
                      onClick={() => onCheckFilter(group.key, value, group.multiple)}
                    >
                      <span
                        style={{
                          color: (filter[group.key] || []).includes(value) ? '#fff' : '#c1c2c5',
                        }}
                      >
                        {value}
                      </span>
                    </Chip>
                  ))}
                </Chip.Group>
              </div>
            ))}
            <Button
              radius="xl"
              size="xs"
              style={{
                width: '100%',
                borderRadius: '24px',
                marginTop: '12px',
                border: '1px solid #9A5DFF',
                backgroundColor: 'rgba(43, 45, 48, 0.50)',
              }}
              onClick={onClear}
            >
              Clear all filters
            </Button>
          </ScrollArea.Autosize>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}

export const useStyles = createStyles((theme) => ({
  root: {
    '& .mantine-Chip-label': {
      borderRadius: '16px',
      border: '1px solid #2B2D30',
      background: 'rgba(43, 45, 48, 0.50)',
      padding: '0px 20px',
      height: '32px',
      lineHeight: '28px',
      color: '#9B9C9E',
      '&[data-checked]': {
        padding: '0px 20px',
        border: '1px solid #9A5DFF !important',
        '& .mantine-Chip-iconWrapper': {
          display: 'none',
        },
      },
    },
  },
  downnnn: {
    transition: '0.5s',
    '&.open': {
      transform: 'rotate(180deg)',
    },
  },

  chip: {
    '&[data-checked]': {
      color: '#fff',
    },
  },
}));
