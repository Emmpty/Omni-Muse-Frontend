import {
  Alert,
  Badge,
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  createStyles,
} from '@mantine/core';
import { IconDownload, IconStar, IconHeart } from '@tabler/icons-react';
import Link from 'next/link';
import { cloneElement, useState } from 'react';
import { abbreviateNumber } from '~/utils/number-helpers';

const useStyles = createStyles(() => ({
  statBadge: {
    background: 'rgba(212,212,212,0.2)',
    color: 'white',
  },
}));

const IconActionBadge = ({
  text = '',
  className = '',
  onClick,
  children,
}: {
  text?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) => {
  const { classes } = useStyles();

  return (
    <div
      className={`flex items-center gap-1 font-medium cursor-pointer text-defaultText ${classes.modelBadgeText} ${className}`}
      onClick={() => onClick?.()}
    >
      {children}
      {text && <span className="text-[12px]">{text}</span>}
    </div>
  );
};

const LIMIT = 3;
export function ImageResources({
  imageId,
  resourcesProps,
}: {
  imageId: number;
  resourcesProps?: array<any>;
}) {
  const [isLoading, setIsloading] = useState(true);
  const showAll = true;
  const resources = resourcesProps;
  setTimeout(() => {
    setIsloading(false);
  }, 300);

  return (
    <Stack spacing={14}>
      {isLoading ? (
        <Stack spacing="xs">
          <Skeleton height={16} radius="md" />
          <Skeleton height={16} radius="md" />
        </Stack>
      ) : !resources.length ? (
        <Alert
          sx={{
            backgroundColor: '#2B2D30',
          }}
        >
          There are no resources associated with this image
        </Alert>
      ) : (
        (showAll ? resources : resources.slice(0, LIMIT)).map((resource, index) => {
          return (
            <Wrapper resource={resource} key={index}>
              <Card
                p={8}
                sx={{
                  backgroundColor: '#2B2D30',
                  opacity: 1,
                }}
                withBorder
              >
                <Stack spacing="xs">
                  <Group spacing={4} position="apart" noWrap>
                    <Text size="sm" className="text-[#fff] " weight={500} lineClamp={1}>
                      {resource.modelName ?? resource.name}
                    </Text>
                    {resource.type && (
                      <Badge radius="md" size="md" className="bg-[rgba(0,0,0,0.4)] text-[#fff] ">
                        {resource.type}
                      </Badge>
                    )}
                  </Group>
                  <Group spacing={0} position="apart" noWrap>
                    {
                      <Badge radius="sm" size="sm" className="text-[#9B9C9E] bg-transparent !px-0">
                        {resource.modelVersion}
                      </Badge>
                    }
                    <Group spacing={8} noWrap>
                      <IconActionBadge
                        className={'cursor-text'}
                        text={abbreviateNumber(resource.starCount)}
                      >
                        <IconHeart size={14} />
                      </IconActionBadge>
                      <IconActionBadge
                        className="cursor-text"
                        text={abbreviateNumber(resource.collectCount)}
                      >
                        <IconStar size={14} />
                      </IconActionBadge>
                      <IconActionBadge
                        className="cursor-text"
                        text={abbreviateNumber(resource.downloadCount)}
                      >
                        <IconDownload size={14} />
                      </IconActionBadge>
                    </Group>
                  </Group>
                </Stack>
              </Card>
            </Wrapper>
          );
        })
      )}
      {resources.length > LIMIT && (
        <Divider
          label={
            <Group spacing="xs" align="center">
              <Text variant="link" sx={{ cursor: 'pointer' }} onClick={() => setShowAll((x) => !x)}>
                {!showAll ? 'Show more' : 'Show less'}
              </Text>
            </Group>
          }
          labelPosition="center"
          variant="dashed"
        />
      )}
    </Stack>
  );
}

const Wrapper = ({
  resource,
  children,
}: {
  resource: { modelId: number | null; modelName: string | null; modelVersionId: number | null };
  children: React.ReactElement;
}) => {
  if (!resource.modelId) return children;
  return (
    <Link
      href={`/models/${resource.modelId}/${slugit(resource.modelName ?? '')}?modelVersionId=${
        resource.modelVersionId
      }`}
      passHref
    >
      {cloneElement(children, { component: 'a' })}
    </Link>
  );
};
