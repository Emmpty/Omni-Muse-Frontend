import { Stack, StackProps, Text, ThemeIcon } from '@mantine/core';
import { IconCloudOff } from '@tabler/icons-react';

export function NoContent({
  message,
  iconSize = 100,
  children,
  ...props
}: Omit<StackProps, 'align'> & { message?: string; iconSize?: number }) {
  return (
    <Stack {...props} align="center">
      <ThemeIcon size={iconSize} radius={100} style={{ backgroundColor: '#9A5DFF' }}>
        <IconCloudOff style={{ backgroundColor: '#9A5DFF' }} size={iconSize * 0.6} />
      </ThemeIcon>
      <Text size={18} align="center">
        No results found
      </Text>
      {message && <Text align="center">{message}</Text>}
      {children}
    </Stack>
  );
}
