import { ActionIcon, Box, Button, createStyles, Group, ScrollArea } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { containerQuery } from '~/utils/mantine-css-helpers';

export function CategoryTags({ onClick }: any) {
  const { classes, cx } = useStyles();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const categories = [
    { label: 'animation games', value: 'animation games' },
    { label: 'space architecture', value: 'space architecture' },
    { label: 'two dimensional', value: 'two dimensional' },
    { label: '3D', value: '3D' },
    { label: 'boys', value: 'boys' },
    { label: 'girls', value: 'girls' },
    { label: 'IP image', value: 'IP image' },
    { label: 'real life', value: 'real life' },
    { label: 'Chinese style', value: 'Chinese style' },
    { label: 'flat abstract', value: 'flat abstract' },
    { label: 'clothing', value: 'clothing' },
    { label: 'landscape', value: 'landscape' },
    { label: 'animals', value: 'animals' },
    { label: 'plants', value: 'plants' },
    { label: 'photography', value: 'photography' },
    { label: 'character enhancement', value: 'character enhancement' },
    { label: 'painting style enhancement', value: 'painting style enhancement' },
    { label: 'elements Enhance', value: 'elements Enhance' },
    { label: 'screen control', value: 'screen control' },
    { label: 'Other', value: 'Other' },
  ];

  const atStart = scrollPosition.x === 0;
  const atEnd =
    viewportRef.current &&
    scrollPosition.x >= viewportRef.current.scrollWidth - viewportRef.current.offsetWidth - 1;

  const scrollLeft = () => viewportRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => viewportRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  const [_tag, _setTag] = useState(undefined);

  const onTab = (tag: any) => {
    _setTag(tag);
    onClick(tag);
  };

  return (
    <ScrollArea
      viewportRef={viewportRef}
      className={classes.tagsContainer}
      type="never"
      onScrollPositionChange={setScrollPosition}
    >
      <Box className={cx(classes.leftArrow, atStart && classes.hidden)}>
        <ActionIcon
          className={classes.arrowButton}
          variant="transparent"
          radius="xl"
          onClick={scrollLeft}
        >
          <IconChevronLeft />
        </ActionIcon>
      </Box>
      <Group spacing={8} noWrap>
        <Button
          className={classes.tag}
          onClick={() => onTab(undefined)}
          compact
          styles={{
            root: {
              background: 'rgba(43, 45, 48, 0.00)',
              border: !_tag ? '1px solid #9A5DFF' : undefined,
              color: !_tag ? '#fff' : '#9B9C9E',
              padding: '0px 24px',
              height: '36px',
            },
          }}
        >
          All
        </Button>
        {categories.map((tag) => {
          const active = _tag === tag.label;
          return (
            <Button
              key={tag.value}
              className={classes.tag}
              onClick={() => onTab(!active ? tag.label : undefined)}
              compact
              styles={{
                root: {
                  background: 'rgba(43, 45, 48, 0.00)',
                  border: active ? '1px solid #9A5DFF' : '',
                  color: active ? '#fff' : '#9B9C9E',
                  padding: '0px 24px',
                  height: '36px',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                },
              }}
            >
              {tag.label}
            </Button>
          );
        })}
      </Group>
      <Box className={cx(classes.rightArrow, atEnd && classes.hidden)}>
        <ActionIcon
          className={classes.arrowButton}
          variant="transparent"
          radius="xl"
          onClick={scrollRight}
        >
          <IconChevronRight />
        </ActionIcon>
      </Box>
    </ScrollArea>
  );
}

const useStyles = createStyles((theme) => ({
  tagsContainer: {
    position: 'relative',
    margin: '12px auto',
    width: '100%',
    // maxWidth: '1706px',
  },
  tag: {
    textTransform: 'uppercase',
    '&:hover': {
      color: '#fff !important',
      backgroundColor: 'transparent',
    },
  },
  title: {
    display: 'none',

    [containerQuery.largerThan('sm')]: {
      display: 'block',
    },
  },
  arrowButton: {
    '&:active': {
      transform: 'none',
    },
  },
  hidden: {
    display: 'none !important',
  },
  leftArrow: {
    display: 'none',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    paddingRight: theme.spacing.xl,
    zIndex: 12,
    backgroundImage: theme.fn.gradient({
      from: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
      to: 'transparent',
      deg: 90,
    }),

    [containerQuery.largerThan('md')]: {
      display: 'block',
    },
  },
  rightArrow: {
    display: 'none',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    paddingLeft: theme.spacing.xl,
    zIndex: 12,
    backgroundImage: theme.fn.gradient({
      from: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
      to: 'transparent',
      deg: 270,
    }),

    [containerQuery.largerThan('md')]: {
      display: 'block',
    },
  },
  viewport: {
    overflowX: 'scroll',
    overflowY: 'hidden',
  },
}));
