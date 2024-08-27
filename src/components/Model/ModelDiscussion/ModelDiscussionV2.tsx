import { Group, LoadingOverlay, Stack, Text } from '@mantine/core';
import { IconMessageCancel } from '@tabler/icons-react';
import React, { useState, useEffect, useRef } from 'react';
import { RoutedDialogLink } from '~/components/Dialog/RoutedDialogProvider';
import { NoContent } from '~/components/NoContent/NoContent';
import { MasonryGrid2 } from '~/components/MasonryGrid/MasonryGrid2';
import { CommentDiscussionItem } from '~/components/Model/ModelDiscussion/CommentDiscussionItem';
import { ReviewSort } from '~/server/common/enums';
import { ContainerGrid } from '~/components/ContainerGrid/ContainerGrid';
import { useContainerSmallerThan } from '~/components/ContainerProvider/useContainerSmallerThan';
import { getCommentList } from '~/request/api/user/behavior';
import { IComment } from '~/request/api/user/behavior.type';
import { useCommonStore } from '~/store/common.store';
import { CommentType } from '~/request/api/user/behavior.type';

export function ModelDiscussionV2({ contentId, type, initialLimit = 8, onlyHidden }: Props) {
  const isMobile = useContainerSmallerThan('sm');
  const limit = isMobile ? initialLimit / 2 : initialLimit;
  const filters = { contentId, limit, sort: ReviewSort.Newest, hidden: onlyHidden };
  const refreshCommentKey = useCommonStore((state) => state.refreshCommentKey);

  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [isRefetching, setIsRefetching] = useState(false);
  const pageNum = useRef(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchNextPage = async () => {
    await getCommentData();
  };

  const getCommentData = async () => {
    const isFirst = pageNum.current === 1;
    isFirst ? setIsLoading(true) : setIsFetchingNextPage(true);
    const res = await getCommentList({ contentId, type, page: pageNum.current, limit: 8 }).finally(
      () => {
        isFirst ? setIsLoading(false) : setIsFetchingNextPage(false);
      }
    );
    const { comments: fetchComments, totalPages, currentPage } = res.result;
    if (res.code === 200) {
      const data = isFirst ? fetchComments : [...comments, ...fetchComments];
      setComments(data);
      const hasNextPage = totalPages > currentPage;
      setHasNextPage(hasNextPage);
      if (hasNextPage) pageNum.current += 1;
    }
  };

  const hiddenCommentsCount = 0;
  const hasHiddenComments = hiddenCommentsCount > 0;

  useEffect(() => {
    if (contentId && type) {
      pageNum.current = 1;
      getCommentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, type, refreshCommentKey]);

  return (
    <ContainerGrid gutter="xl">
      <ContainerGrid.Col py={30} span={12} sx={{ position: 'relative' }}>
        {isLoading ? (
          <div className="h-[200px]">
            <LoadingOverlay visible={isLoading} zIndex={10} overlayOpacity={0} />
          </div>
        ) : comments?.length > 0 ? (
          <Stack spacing={8}>
            <MasonryGrid2
              data={comments}
              render={({ data }) => (
                <CommentDiscussionItem data={data} contentId={contentId} type={type} />
              )}
              isRefetching={false}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              filters={filters}
              columnWidth={300}
              autoFetch={false}
            />
            {hasHiddenComments && !onlyHidden && (
              <RoutedDialogLink
                name="hiddenModelComments"
                // @ts-ignore
                state={{ modelId: contentId }}
                style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center' }}
              >
                <Text size="xs" color="dimmed">
                  <Group spacing={4} position="center">
                    <IconMessageCancel size={16} />
                    <Text inherit inline>
                      {`See ${hiddenCommentsCount} more hidden ${
                        hiddenCommentsCount > 1 ? 'comments' : 'comment'
                      }`}
                    </Text>
                  </Group>
                </Text>
              </RoutedDialogLink>
            )}
          </Stack>
        ) : (
          <NoContent iconSize={60} />
        )}
      </ContainerGrid.Col>
    </ContainerGrid>
  );
}

type Props = {
  contentId: string;
  type: CommentType;
  initialLimit?: number;
  onlyHidden?: boolean;
};
