import { Card, Group, Stack, Text, createStyles, Image } from '@mantine/core';
import {
  IconBrandPython,
  IconFileText,
  IconFolder,
  IconMarkdown,
  IconTxt,
} from '@tabler/icons-react';

import { formatBytes } from '~/utils/number-helpers';
import { useState } from 'react';
import { getDownloadUrl } from '~/request/api/user';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import XButton from '~/omnimuse-lib/components/XButton';
const fileCosmetics = {
  txt: {
    icon: <IconTxt size={26} />,
    color: 'violet',
  },
  pdf: {
    icon: <IconFileText size={26} />,
    color: 'red',
  },
  md: {
    icon: <IconMarkdown size={26} />,
    color: 'gray',
  },
  zip: {
    icon: <IconFolder size={26} />,
    color: '#fff',
  },
  folder: {
    icon: <IconFolder size={26} />,
    color: 'white',
  },
  py: {
    icon: <IconBrandPython size={26} />,
    color: 'blue',
  },
} as const;

const useStyles = createStyles((theme) => ({
  attachment: {
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.lighten(theme.colors.dark[4], 0.05)
          : theme.fn.darken(theme.colors.gray[0], 0.05),
    },
  },
}));

export function AttachmentCard({ id, name, sizeKB, url, parentMethod }: Props) {
  const { classes } = useStyles();
  const extension = url?.split('.').pop() as keyof typeof fileCosmetics;
  const { icon } = fileCosmetics[extension] ?? fileCosmetics.pdf;
  const [opened, setopen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const getDownloadLink = async () => {
    setopen(true);
  };
  const handleConfirm = async () => {
    window.open(fileUrl, '_black');
    const res = await getDownloadUrl({ id: id, type: 'dataset' });
    if (res.code === 200) {
      setFileUrl(res.result.urls[name]);
      parentMethod();
    }
  };
  return (
    <Card className={classes.attachment} radius={0} py="xs" component="a" onClick={getDownloadLink}>
      <MantineModal width={757} title="Download" opened={opened} onClose={() => setopen(false)}>
        <div className="pt-[50px] px-[50px] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <Image alt="coin" className="!w-[32px]" src="/images/icon/gold.svg" />
            <span className="text-[26px] text-coinText text-nowrap font-medium">0</span>
          </div>
          <span className="text-defaultText text-sm">You can download it for free</span>
          <XButton
            type="primary"
            className={`mt-[50px] mb-[50px] !rounded-[40px] w-[388px]`}
            onClick={() => {
              handleConfirm();
            }}
          >
            Get Download Url
          </XButton>
        </div>
      </MantineModal>
      <Group spacing="xs" noWrap className="cursor-pointer">
        {icon}
        <Stack spacing={0}>
          <Text size="sm" lineClamp={1}>
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            {formatBytes(sizeKB, 0)}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}

type Props = Pick<any, 'id' | 'name' | 'sizeKB' | 'url' | 'parentMethod'>;
