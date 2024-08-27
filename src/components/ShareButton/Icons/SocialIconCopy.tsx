import { Center, useMantineTheme } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

export function SocialIconCopy({ copied }: { copied: boolean }) {
  const theme = useMantineTheme();
  const { background } = theme.fn.variant({ color: copied ? 'green' : 'gray', variant: 'filled' });

  return (
    <Center style={{ height: '100%', width: '100%', borderRadius: '100%' }}>
      {copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
    </Center>
  );
}
