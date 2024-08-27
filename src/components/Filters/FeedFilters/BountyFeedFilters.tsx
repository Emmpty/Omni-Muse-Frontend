import { Group, Menu, Button, createStyles, Popover, Chip, ScrollArea } from '@mantine/core';
import { IconCheck, IconChevronDown, IconFilter } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useEventStore } from '~/pages/bounties/index';

export function BountyFeedFilters() {
  const { classes } = useStyles();
  const reload = useEventStore((state: any) => state.reload);
  // 排序相关
  const [sort, setSort] = useState('highest bounty');
  const [opens, setOpens] = useState(false);
  const handleSort = (value: string) => {
    console.log(value);
    setSort(value);
    emitLoad({
      sort: value,
    });
  };
  const sortItems = [
    {
      label: 'Highest bounty',
      value: 'highest bounty',
    },
    {
      label: 'Most likes',
      value: 'most likes',
    },
    {
      label: 'Most collections',
      value: 'Most collections',
    },
    {
      label: 'Most comments',
      value: 'most comments',
    },
    {
      label: 'Most participation',
      value: 'most participation',
    },
    {
      label: 'Oldest',
      value: 'oldest',
    },
    {
      label: 'Newest',
      value: 'newest',
    },
  ];

  // 过滤相关
  const filterItems = [
    {
      label: 'Time priod',
      key: 'TimePeriod',
      multiple: false,
      items: [
        {
          label: 'Day',
          value: 'Day',
        },
        {
          label: 'Week',
          value: 'Week',
        },
        {
          label: 'Month',
          value: 'Month',
        },
        {
          label: 'Year',
          value: 'Year',
        },
        {
          label: 'All Time',
          value: 'All Time',
        },
      ],
    },
    {
      label: 'Bounties type',
      key: 'BountiesType',
      multiple: true,
      items: [
        {
          label: 'Checkpoint',
          value: 'Checkpoint',
        },
        {
          label: 'Textual Inversion',
          value: 'Textual Inversion',
        },
        {
          label: 'Hypernetwork',
          value: 'Hypernetwork',
        },
        {
          label: 'LORA',
          value: 'LORA',
        },
        {
          label: 'LyCORIS',
          value: 'LyCORIS',
        },
        {
          label: 'Controlnet',
          value: 'Controlnet',
        },
        {
          label: 'Wildcards',
          value: 'Wildcards',
        },
      ],
    },
    {
      label: 'Bounties Status',
      key: 'BountiesStatus',
      multiple: false,
      items: [
        {
          label: 'All the time',
          value: 'All the time',
        },
        {
          label: 'In progress',
          value: 'In progress',
        },
        {
          label: 'Over',
          value: 'Over',
        },
      ],
    },
  ];
  const [openf, setOpenf] = useState(false);
  const [filter, setFilter] = useState<any>({
    TimePeriod: 'All Time',
    BountiesType: [],
    BountiesStatus: 'In progress',
  });

  const onCheckFilter = (key: string, value: string, multiple: boolean) => {
    const checks: any = filter[key] || [];
    const isDel = checks.includes(value);
    const newb: any = {
      [key]: '',
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
        newb[key] = value;
        setFilter(Object.assign({}, filter, newb));
      }
    }
    console.log(filter);
    emitLoad({
      filter: Object.assign({}, filter, newb),
    });
  };
  const onClear = () => {
    const defaultV = {
      stage: 'all',
    };
    setFilter(defaultV);
    emitLoad({
      stage: defaultV,
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
            borderRadius: ' 8px',
            background: '#161718',
          }}
        >
          <ScrollArea.Autosize w={560} maxHeight={350} type="auto" offsetScrollbars>
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

export const useStyles = createStyles(() => ({
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
