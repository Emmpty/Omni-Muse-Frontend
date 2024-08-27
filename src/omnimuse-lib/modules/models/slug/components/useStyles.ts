import { createStyles } from '@mantine/core';
import { containerQuery } from '~/utils/mantine-css-helpers';

const useStyles = createStyles((theme) => ({
  titleWrapper: {
    [containerQuery.smallerThan('md')]: {
      gap: theme.spacing.xs * 0.4,
    },
  },

  title: {
    wordBreak: 'break-word',
    [containerQuery.smallerThan('md')]: {
      fontSize: 24,
      width: '100%',
      paddingBottom: 0,
    },
  },

  modelBadgeText: {
    fontSize: theme.fontSizes.md,
    [containerQuery.smallerThan('md')]: {
      fontSize: theme.fontSizes.sm,
    },
  },
}));

export default useStyles;
