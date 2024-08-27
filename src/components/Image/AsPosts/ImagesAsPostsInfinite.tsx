import { Box, Center, Group, Loader, LoadingOverlay, Paper, Stack, Title } from '@mantine/core';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ImagesAsPostsCard } from '~/components/Image/AsPosts/ImagesAsPostsCard';
import { useImageFilters } from '~/components/Image/image.utils';
import { InViewLoader } from '~/components/InView/InViewLoader';
import { MasonryColumns } from '~/components/MasonryColumns/MasonryColumns';
import { MasonryContainer } from '~/components/MasonryColumns/MasonryContainer';
import { MasonryProvider } from '~/components/MasonryColumns/MasonryProvider';
import { removeEmpty } from '~/utils/object-helpers';
import { ModelById } from '~/types/router';
import { getModelGalleryList } from '~/request/api/model';
import { NoContent } from '~/components/NoContent/NoContent';
// 页面-画廊
type ModelVersionsProps = { id: number; name: string; modelId: number };
type ImagesAsPostsInfiniteState = {
  model: ModelById;
  modelVersions?: ModelVersionsProps[];
  filters: {
    modelId?: number;
    username?: string;
  } & Record<string, unknown>;
  showModerationOptions?: boolean;
};
const ImagesAsPostsInfiniteContext = createContext<ImagesAsPostsInfiniteState | null>(null);
export const useImagesAsPostsInfiniteContext = () => {
  const context = useContext(ImagesAsPostsInfiniteContext);
  if (!context) throw new Error('ImagesInfiniteContext not in tree');
  return context;
};

type ImagesAsPostsInfiniteProps = {
  selectedVersionId?: number;
  model: ModelById;
  username?: string;
  modelVersions?: ModelVersionsProps[];
  generationOptions?: { generationModelId?: number; includeEditingActions?: boolean };
  showModerationOptions?: boolean;
  showPOIWarning?: boolean;
  canReview?: boolean;
};

export default function ImagesAsPostsInfinite({
  model,
  username,
  modelVersions,
  selectedVersionId,
  generationOptions,
  showModerationOptions,
}: ImagesAsPostsInfiniteProps) {
  const [showHidden, setShowHidden] = useState(false);
  const imageFilters = useImageFilters('modelImages');
  const filters = removeEmpty({
    ...imageFilters,
    modelVersionId: selectedVersionId,
    modelId: model.id,
    username,
    hidden: showHidden, // override global hidden filter
  });
  const enabled = true;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const fetchNextPage = () => {
    // 3124
  };

  const handleGetGalleryList = async () => {
    setIsLoading(true);
    const { code, result } = await getModelGalleryList(model.id).finally(() => {
      setIsLoading(false);
    });
    if (code === 200) {
      setData(result);
    }
  };

  useEffect(() => {
    handleGetGalleryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.id]);

  const items = useMemo(
    () => (data?.pages ? data?.pages.flatMap((x) => (!!x ? x.items : [])) : []),
    [data]
  );

  return (
    <ImagesAsPostsInfiniteContext.Provider
      value={{ filters, modelVersions, showModerationOptions, model }}
    >
      <Box
        py="xl"
        px="md"
        className="bg-transparent w-[1400px]"
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-around',
          gap: theme.spacing.md,
        })}
      >
        <MasonryProvider
          columnWidth={310}
          maxColumnCount={6}
          maxSingleColumnWidth={450}
          style={{ flex: 1 }}
        >
          <MasonryContainer>
            <Stack spacing="md">
              <Group spacing="xs" mb={10}>
                <Title order={2}>Gallery</Title>
              </Group>
              {enabled && isLoading ? (
                <Paper style={{ minHeight: 200, position: 'relative' }}>
                  <LoadingOverlay
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    visible
                    zIndex={10}
                  />
                </Paper>
              ) : !!items.length ? (
                <div style={{ position: 'relative' }}>
                  <LoadingOverlay
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    visible={isRefetching ?? false}
                    zIndex={9}
                  />
                  <MasonryColumns
                    data={items}
                    staticItem={
                      !!generationOptions?.generationModelId && selectedVersionId
                        ? (props) => (
                            <></>
                          )
                        : undefined
                    }
                    imageDimensions={(data) => {
                      const tallestImage = data.images.sort((a: any, b: any) => {
                        const aHeight = a.height ?? 0;
                        const bHeight = b.height ?? 0;
                        const aAspectRatio = aHeight > 0 ? (a.width ?? 0) / aHeight : 0;
                        const bAspectRatio = bHeight > 0 ? (b.width ?? 0) / bHeight : 0;
                        if (aAspectRatio < 1 && bAspectRatio >= 1) return -1;
                        if (bAspectRatio < 1 && aAspectRatio <= 1) return 1;
                        if (aHeight === bHeight) return 0;
                        return aHeight > bHeight ? -1 : 1;
                      })[0];

                      const width = tallestImage?.width ?? 450;
                      const height = tallestImage?.height ?? 450;
                      return { width, height };
                    }}
                    adjustHeight={({ height }) => {
                      const imageHeight = Math.min(height, 600);
                      return imageHeight;
                    }}
                    maxItemHeight={600}
                    render={ImagesAsPostsCard}
                    itemId={(data) => data.images.map((x: any) => x.id).join('_')}
                    withAds
                  />
                  {hasNextPage && (
                    <InViewLoader
                      loadFn={fetchNextPage}
                      loadCondition={!isFetching}
                      style={{ gridColumn: '1/-1' }}
                    >
                      <Center p="xl" sx={{ height: 36 }} mt="md">
                        <Loader />
                      </Center>
                    </InViewLoader>
                  )}
                </div>
              ) : (
                <NoContent iconSize={60} />
              )}
            </Stack>
          </MasonryContainer>
        </MasonryProvider>
      </Box>
    </ImagesAsPostsInfiniteContext.Provider>
  );
}
