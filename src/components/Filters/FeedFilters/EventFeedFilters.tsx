import { Group, Menu, Button, createStyles, Popover, Chip, ScrollArea } from '@mantine/core';
import { IconCheck, IconChevronDown, IconSortDescending, IconFilter } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { useEventStore } from '~/pages/events/index';

export function EventFilters() {
  const { classes } = useStyles();
  const reload = useEventStore((state: any) => state.reload);
  // 排序相关
  const [sort, setSort] = useState('hot');
  const [opens, setOpens] = useState(false);
  const handleSort = (value: string) => {
    setSort(value);
    emitLoad({
      sort: value,
    });
  };
  const sortItems = [
    {
      label: 'Most Popular',
      value: 'hot',
    },
    {
      label: 'Oldest',
      value: 'old',
    },
    {
      label: 'Newest',
      value: 'new',
    },
  ];

  // 过滤相关
  const filterItems = [
    {
      label: 'Time period',
      key: 'time',
      multiple: false,
      items: [
        {
          label: 'Day',
          value: 'day',
        },
        {
          label: 'Week',
          value: 'week',
        },
        {
          label: 'Month',
          value: 'month',
        },
        {
          label: 'Year',
          value: 'year',
        },
        {
          label: 'All Time',
          value: 'all',
        },
      ],
    },
    {
      label: 'Event Status',
      key: 'stage',
      multiple: false,
      items: [
        {
          label: 'Finishing',
          value: 'finish',
        },
        {
          label: 'Ongoing',
          value: 'process',
        },
        {
          label: 'All Status',
          value: 'all',
        },
      ],
    },
  ];
  const [openf, setOpenf] = useState(false);
  const [filter, setFilter] = useState<any>({
    stage: 'process',
    time: 'all',
  });

  const onCheckFilter = (key: string, value: string, multiple: boolean) => {
    const checks: any = filter[key] || [];
    const isDel = checks.includes(value);
    const newb: any = {
      [key]: [],
    };
    if (isDel) {
    } else {
      newb[key] = value;
      setFilter(Object.assign({}, filter, newb));
    }
    if (key == 'stage') {
      emitLoad({
        stage: value,
      });
    }

    if (key == 'time') {
      emitLoad({
        time: value,
      });
    }
  };
  const onClear = () => {
    const defaultV = {
      stage: 'process',
      time: 'all',
    };
    setFilter(defaultV);
    emitLoad({
      stage: defaultV,
    });
  };

  const emitLoad = (data: any) => {
    reload(Object.assign(data, { pageNum: 1 }));
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
            <div style={{ fontSize: '14px', color: '#fff' }}>
              {sortItems.find((item) => item.value == sort)?.label}
            </div>
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
            <Menu.Item key={item.value} onClick={() => handleSort(item.value)}>
              <div
                style={{
                  width: '160px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                {item.label}
                {sort === item.value ? (
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
        transition="pop"
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
            <IconFilter size={16} />
          </div>
        </Popover.Target>
        <Popover.Dropdown
          maw={600}
          p="md"
          w="100%"
          style={{
            borderRadius: '8px',
            background: '#161718',
          }}
        >
          <ScrollArea.Autosize maxHeight={300} w={560} type="auto" offsetScrollbars>
            {filterItems.map((group, index) => (
              <div key={group.key}>
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
                  {group.items.map(({ label, value }) => (
                    <Chip
                      key={value}
                      className={classes.chip}
                      value={value}
                      onClick={() => onCheckFilter(group.key, value, group.multiple)}
                    >
                      <span
                        style={{
                          color: filter[group.key] == value ? '#fff' : '#c1c2c5',
                        }}
                      >
                        {label}
                      </span>
                    </Chip>
                  ))}
                </Chip.Group>
              </div>
            ))}
          </ScrollArea.Autosize>
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
        border: '1px solid #9A5DFF !important',
        padding: '0px 20px',
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
