import { Carousel } from '@mantine/carousel';
import { Box, Center, createStyles, Loader } from '@mantine/core';
import { containerQuery } from '~/utils/mantine-css-helpers';
import { BrowsingModeOverrideProvider } from '~/components/BrowsingLevel/BrowsingLevelProvider';
import { useEffect, useState } from 'react';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { getModelImages } from '~/request/api/model';

const useStyles = createStyles(() => ({
  control: {
    svg: {
      width: 24,
      height: 24,

      [containerQuery.smallerThan('sm')]: {
        minWidth: 16,
        minHeight: 16,
      },
    },
  },
  carousel: {
    display: 'block',
    [containerQuery.smallerThan('md')]: {
      display: 'none',
    },
  },
  mobileBlock: {
    display: 'block',
    [containerQuery.largerThan('md')]: {
      display: 'none',
    },
  },
  top: { top: 0 },
}));

export function ModelCarousel(props: Props) {
  return (
    <BrowsingModeOverrideProvider>
      <ModelCarouselContent {...props} />
    </BrowsingModeOverrideProvider>
  );
}

function ModelCarouselContent({ modelVersionId, mobile = false }: Props) {
  const { classes, cx } = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const handleGetImages = async () => {
    setIsLoading(true);
    const res = await getModelImages(modelVersionId).finally(() => {
      setIsLoading(false);
    });
    if (res.code === 200 && res.result) {
      setImages(res.result);
    }
  };
  useEffect(() => {
    if (modelVersionId) {
      handleGetImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelVersionId]);

  if (isLoading)
    return (
      <Box
        className={cx(!mobile && classes.carousel, mobile && classes.mobileBlock)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: mobile ? 300 : 600,
        }}
      >
        <Center>
          <Loader size="md" />
        </Center>
      </Box>
    );

  return (
    <Carousel
      key={modelVersionId}
      className={cx(!mobile && classes.carousel, mobile && classes.mobileBlock)}
      classNames={classes}
      slideSize="50%"
      breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: 2 }]}
      slideGap="xl"
      align={images.length > 2 ? 'start' : 'center'}
      slidesToScroll={mobile ? 1 : 2}
      withControls={images.length > 2 ? true : false}
      controlSize={mobile ? 32 : 56}
      loop
    >
      {images.map((image, index) => {
        return (
          <Carousel.Slide key={index}>
            <Center h="100%" w="100%">
              <div style={{ width: '100%', position: 'relative' }}>
                <div className="w-[413px] rounded-lg overflow-hidden">
                  <EdgeMedia src={image} cid={image} width={413} loading="lazy" />
                </div>
              </div>
            </Center>
          </Carousel.Slide>
        );
      })}
    </Carousel>
  );
}

type Props = {
  modelVersionId: number;
  mobile?: boolean;
  onBrowseClick?: VoidFunction;
};
