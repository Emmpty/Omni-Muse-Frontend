import {
  ActionIcon,
  AspectRatio,
  Box,
  BoxProps,
  Center,
  createStyles,
  Group,
  MantineNumberSize,
} from '@mantine/core';
import { MediaHash } from '~/components/ImageHash/ImageHash';
import { EdgeMedia, EdgeMediaProps } from '~/components/EdgeMedia/EdgeMedia';
import { IconInfoCircle } from '@tabler/icons-react';
import { ImageMetaPopover } from '~/components/ImageMeta/ImageMeta';
import { getClampedSize } from '~/utils/blurhash';
import { CSSProperties } from 'react';
import { ImageGetInfinite } from '~/types/router';

type ImagePreviewProps = {
  nsfw?: boolean;
  aspectRatio?: number;
  image: Pick<
    ImageGetInfinite[number],
    | 'id'
    | 'url'
    | 'name'
    | 'width'
    | 'height'
    | 'hash'
    | 'meta'
    | 'generationProcess'
    | 'type'
    | 'cid'
  >;
  edgeImageProps?: Omit<EdgeMediaProps, 'src'>;
  withMeta?: boolean;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  radius?: MantineNumberSize;
  cropFocus?: 'top' | 'bottom' | 'left' | 'right' | 'center';
} & Omit<BoxProps, 'component'>;

export function ImagePreview({
  image: { id, url, name, type, width, height, hash, meta, generationProcess, cid },
  edgeImageProps = {},
  nsfw,
  aspectRatio,
  withMeta,
  style,
  onClick,
  className,
  radius = 0,
  cropFocus,
  ...props
}: ImagePreviewProps) {
  const { classes, cx } = useStyles({ radius });

  aspectRatio ??= Math.max((width ?? 16) / (height ?? 9), 9 / 16);
  if (edgeImageProps.width === 'original') edgeImageProps.width = width ?? undefined;

  if (!edgeImageProps.width && !edgeImageProps.height) {
    if (!edgeImageProps.height && width) edgeImageProps.width = width;
    else if (!edgeImageProps.width && height) edgeImageProps.height = height;
  }

  if (!width || !height) return null;
  const { width: cw, height: ch } = getClampedSize(
    width,
    height,
    // @ts-ignore
    edgeImageProps.height ?? edgeImageProps.width ?? 500,
    edgeImageProps.height ? 'height' : edgeImageProps.width ? 'width' : 'all'
  );

  const Meta = !nsfw && withMeta && meta && (
    <ImageMetaPopover meta={meta} generationProcess={generationProcess ?? 'txt2img'} imageId={id}>
      <ActionIcon variant="transparent" size="lg">
        <IconInfoCircle
          color="white"
          filter="drop-shadow(1px 1px 2px rgb(0 0 0 / 50%)) drop-shadow(0px 5px 15px rgb(0 0 0 / 60%))"
          opacity={0.8}
          strokeWidth={2.5}
          size={26}
        />
      </ActionIcon>
    </ImageMetaPopover>
  );

  const edgeImageStyle: CSSProperties = {
    ...edgeImageProps.style,
    maxHeight: '100%',
    maxWidth: '100%',
  };
  if (style?.height || style?.maxHeight) edgeImageStyle.maxHeight = '100%';
  const Image = nsfw ? (
    <Center style={{ width: cw, height: ch, maxWidth: '100%' }}>
      <MediaHash hash={hash} width={width} height={height} />
    </Center>
  ) : (
    <EdgeMedia
      src={url}
      cid={cid}
      name={name ?? id.toString()}
      alt={name ?? undefined}
      type={type}
      {...edgeImageProps}
      onClick={onClick}
      style={edgeImageStyle}
    />
  );

  return (
    <Box className={cx(classes.root, className)} style={{ ...style }} {...props}>
      {aspectRatio === 0 ? (
        Image
      ) : (
        <AspectRatio
          ratio={aspectRatio}
          sx={{
            color: 'white',
            ['& > img, & > video']: {
              objectPosition: cropFocus ?? 'center',
            },
          }}
        >
          {Image}
        </AspectRatio>
      )}
      <Group spacing={4} sx={{ position: 'absolute', bottom: '5px', right: '5px' }}>
        {Meta}
      </Group>
    </Box>
  );
}

const useStyles = createStyles((theme, { radius }: { radius?: MantineNumberSize }) => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.fn.radius(radius),
  },
}));
