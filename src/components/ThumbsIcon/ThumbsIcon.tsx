import { useMantineTheme } from '@mantine/core';
import {
  IconThumbDown,
  IconThumbDownFilled,
  IconHeart,
  IconHeartFilled,
  TablerIconsProps,
} from '@tabler/icons-react';

export function ThumbsUpIcon({ filled, ...iconProps }: Props) {
  return filled ? <IconHeartFilled {...iconProps} /> : <IconHeart {...iconProps} />;
}

export function ThumbsDownIcon({ filled, ...iconProps }: Props) {
  const theme = useMantineTheme();

  return filled ? (
    <IconThumbDownFilled
      {...iconProps}
      color={theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white}
    />
  ) : (
    <IconThumbDown {...iconProps} />
  );
}

type Props = TablerIconsProps & { filled?: boolean };
