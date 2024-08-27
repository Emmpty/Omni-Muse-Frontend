import { Group, Menu, createStyles } from '@mantine/core';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useEventStore } from '~/pages/data-set/index';
export function DataSetFilters() {
  const { classes } = useStyles();
  const reload = useEventStore((state: any) => state.reload);
  // 排序相关
  const [sort, setSort] = useState('most likes');
  const [opens, setOpens] = useState(false);
  const handleSort = (value: string) => {
    setSort(value);
    emitLoad({
      sort: value,
    });
  };
  const sortItems = [
    {
      label: 'Most Likes',
      value: 'most likes',
    },
    {
      label: 'Most Favorites',
      value: 'most favorites',
    },
    {
      label: 'Most Comments',
      value: 'most comments',
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
