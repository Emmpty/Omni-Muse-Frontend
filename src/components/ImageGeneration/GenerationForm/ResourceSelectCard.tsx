import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { ModelType } from '~/types/prisma/schema';
import { IconAlertTriangle, IconReplace, IconX } from '@tabler/icons-react';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { NumberSlider } from '~/libs/form/components/NumberSlider';
import { generationPanel } from '~/store/generation.store';

type Props = {
  resource: any;
  onUpdate?: (value: any) => void;
  onRemove?: (id: number) => void;
  onSwap?: VoidFunction;
};

export const ResourceSelectCard = (props: Props) => {
  const isCheckpoint = props.resource.modelType === ModelType.Checkpoint;

  return isCheckpoint ? <CheckpointInfo {...props} /> : <ResourceInfo {...props} />;
};

function CheckpointInfo({ resource, onRemove, onSwap }: Props) {
  const unavailable = resource.covered === false;

  return (
    <Card px="sm" py={8} radius="md" withBorder>
      <Group spacing="xs" position="apart" noWrap>
        <Group spacing={4} noWrap>
          {unavailable ? (
            <ThemeIcon color="red" w="auto" size="sm" px={4} mr={8}>
              <Group spacing={4}>
                <IconAlertTriangle size={16} strokeWidth={3} />
                <Text size="xs" weight={500}>
                  Unavailable
                </Text>
              </Group>
            </ThemeIcon>
          ) : resource.image ? (
            <Paper radius="sm" mr={8} style={{ overflow: 'hidden' }} w={64} h={64}>
              <EdgeMedia type="image" src={resource.image?.url} width={64} />
            </Paper>
          ) : null}
          <Stack spacing={2}>
            <Text
              component={NextLink}
              sx={{ cursor: 'pointer' }}
              href={`/models/${resource.modelId}?modelVersionId=${resource.id}`}
              rel="nofollow noindex"
              lineClamp={1}
              weight={590}
            >
              {resource.modelName}
            </Text>
            <Text size="sm" color="dimmed">
              {resource.name}
            </Text>
          </Stack>
        </Group>
        {onRemove ? (
          <ActionIcon size="sm" variant="subtle" onClick={() => onRemove(resource.id)}>
            <IconX size={20} />
          </ActionIcon>
        ) : (
          <Button variant="light" radius="xl" size="sm" onClick={onSwap} compact>
            <Group spacing={4} noWrap>
              <IconReplace size={16} />
              <Text size="sm" weight={500}>
                Swap  88888
              </Text>
            </Group>
          </Button>
        )}
      </Group>
    </Card>
  );
}

function ResourceInfo({ resource, onRemove, onUpdate }: Props) {
  const hasStrength =
    resource.modelType === ModelType.LORA || resource.modelType === ModelType.LoCon;
  const isSameMinMaxStrength = resource.minStrength === resource.maxStrength;
  const unavailable = resource.covered === false;

  return (
    <Group spacing="xs" position="apart" noWrap>
      <Stack spacing={4} w="100%">
        <Group spacing={4} noWrap>
          {unavailable && (
            <ThemeIcon color="red" w="auto" size="sm" px={4} mr={8}>
              <Group spacing={4}>
                <IconAlertTriangle size={16} strokeWidth={3} />
                <Text size="xs" weight={500}>
                  Unavailable
                </Text>
              </Group>
            </ThemeIcon>
          )}
          <Text
            component={NextLink}
            sx={{ cursor: 'pointer' }}
            href={`/models/${resource.modelId}?modelVersionId=${resource.id}`}
            onClick={() => generationPanel.close()}
            rel="nofollow noindex"
            size="sm"
            lineClamp={1}
            weight={590}
          >
            {resource.modelName} @@@@
          </Text>
          {resource.modelName.toLowerCase() !== resource.name.toLowerCase() && (
            <Badge size="sm" color="dark.5" variant="filled" miw="42px">
              {resource.name}
            </Badge>
          )}
        </Group>
        {/* LORA */}
        {hasStrength && onUpdate && !unavailable && (
          <Group spacing="xs" align="center">
            <NumberSlider
              value={resource.strength}
              onChange={(strength) => onUpdate({ ...resource, strength })}
              min={!isSameMinMaxStrength ? resource.minStrength ?? -1 : -1}
              max={!isSameMinMaxStrength ? resource.maxStrength ?? 2 : 2}
              step={0.05}
              sx={{ flex: 1 }}
              reverse
            />
          </Group>
        )}
      </Stack>
      {onRemove && (
        <ActionIcon size="sm" variant="subtle" onClick={() => onRemove(resource.id)}>
          <IconX size={20} />
        </ActionIcon>
      )}
    </Group>
  );
}
