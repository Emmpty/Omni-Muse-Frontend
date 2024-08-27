import React, { useRef, useState } from 'react';
import { ActionIcon, Group, Select, Input, createStyles } from '@mantine/core';
import { getHotkeyHandler, /** useClickOutside, */ useHotkeys } from '@mantine/hooks';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';

const targetData = [
  { value: 'models', label: 'Models' },
  { value: 'data-set', label: 'Data-Set' },
  { value: 'bounties', label: 'Bounties' },
  { value: 'events', label: 'Events' },
];

const IntegratedSearch = () => {
  const useStyles = createStyles((theme) => ({
    root: {
      flexGrow: 1,
      [theme.fn.smallerThan('md')]: {
        height: '100%',
        flexGrow: 1,
      },
    },
    wrapper: {
      [theme.fn.smallerThan('md')]: {
        height: '100%',
      },
    },
    input: {
      borderRadius: 0,

      [theme.fn.smallerThan('md')]: {
        height: '100%',
      },
    },
    dropdown: {
      [theme.fn.smallerThan('sm')]: {
        marginTop: '-7px',
      },
    },

    targetSelectorRoot: {
      width: '110px',
      height: '44px',
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [theme.fn.smallerThan('md')]: {
        display: 'none', // TODO.search: Remove this once we figure out a way to prevent hiding the whole bar when selecting a target
        height: '100%',

        '&, & > [role="combobox"], & > [role="combobox"] *': {
          height: '100%',
        },
      },

      [theme.fn.smallerThan('sm')]: {
        width: '25%',
      },
    },

    targetSelectorInput: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderColor: theme.colors.omnimuse[7],
      backgroundColor: theme.colors.omnimuse[6],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      paddingRight: '18px',
      textAlign: 'center',
      height: '44px',

      '&:not(:focus)': {
        borderRightStyle: 'none',
      },

      [theme.fn.smallerThan('md')]: {
        height: '100%',
      },
    },

    targetSelectorRightSection: {
      pointerEvents: 'none',
    },

    targetInputBox: {
      flexGrow: 1,
      height: '44px',
    },

    targetInput: {
      borderRadius: '0px',
      borderColor: theme.colors.omnimuse[7],
      background: theme.colors.omnimuse[3],
      height: '44px',
    },

    searchButton: {
      height: '44px',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderWidth: 1,
      borderLeft: 0,
      borderColor: theme.colors.omnimuse[7],
      backgroundColor: theme.colors.omnimuse[6],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      display: 'flex',
      alignItems: 'center',
      width: '110px',
      gap: '6px',

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[4],
      },

      [theme.fn.smallerThan('md')]: {
        display: 'none',
      },
    },

    searchIcon: {
      width: '22px',
      height: '22px',
    },

    searchText: {
      marginBottom: '2px',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
  }));
  const { classes } = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => inputRef.current?.focus();
  const blurInput = () => inputRef.current?.blur();

  useHotkeys([
    ['/', focusInput],
    ['mod+k', focusInput],
  ]);

  const [type, setType] = useState('models');
  const onTargetChange = (type: string) => {
    setType(type);
  };
  const router = useRouter();
  const handleSubmit = () => {
    const value = inputRef?.current?.value;
    router.push(`/${type}?keywords=${value}`);
    blurInput();
  };
  const handleClear = () => {
    console.log('clear');
  };
  // const wrapperRef = useClickOutside(() => handleClear());

  return (
    // <Group ref={wrapperRef} className={classes.wrapper} spacing={0} noWrap>
    <Group className={classes.wrapper} spacing={0} noWrap>
      <Select
        classNames={{
          root: classes.targetSelectorRoot,
          input: classes.targetSelectorInput,
          rightSection: classes.targetSelectorRightSection,
        }}
        maxDropdownHeight={280}
        defaultValue={targetData[0].value}
        // Ensure we disable search targets if they are not enabled
        data={targetData}
        rightSection={<IconChevronDown size={16} color="currentColor" />}
        sx={{ flexShrink: 1 }}
        onChange={onTargetChange}
        autoComplete="off"
        size="md"
      />
      <Input
        classNames={{
          wrapper: classes.targetInputBox,
          input: classes.targetInput,
        }}
        className="!flex-1"
        onKeyDown={getHotkeyHandler([
          ['Escape', blurInput],
          ['Enter', handleSubmit],
        ])}
        ref={inputRef}
        placeholder="Search Omnimuse"
        size="md"
      />
      <ActionIcon
        className={classes.searchButton}
        variant="filled"
        size={42}
        onClick={handleSubmit}
      >
        <IconSearch className={classes.searchIcon} size={22} />
        <span className={classes.searchText}>Search</span>
      </ActionIcon>
    </Group>
  );
};

export default IntegratedSearch;
