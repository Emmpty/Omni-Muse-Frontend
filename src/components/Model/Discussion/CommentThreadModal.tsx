import { Container, Stack, Title, Anchor, Loader, Group, Center, Text } from '@mantine/core';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDialogContext } from '~/components/Dialog/DialogProvider';
import MantineModal from '~/omnimuse-lib/components/XModal/MantineModal';
import { CommentProvider } from '~/components/CommentSection/CommentProvider';
import { CommentSection } from '~/components/CommentSection/CommentSection';
import { getCommentListById } from '~/request/api/user/behavior';
import { DaysFromNow } from '~/components/Dates/DaysFromNow';
import { RenderHtml } from '~/components/RenderHtml/RenderHtml';
import { Username } from '~/components/User/Username';
import { UserAvatar } from '~/components/UserAvatar/UserAvatar';
import ReactionPicker from '~/omnimuse-lib/features/common/ReactionPicker/ReactionPicker';
import { useCommonStore } from '~/store/common.store';

export default function CommentThreadModal({
  commentId,
  contentId,
  type,
}: {
  commentId: number | string;
  contentId: string;
  type: number;
  highlight?: number;
}) {
  const dialog = useDialogContext();
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentDetail, setCommentDetail] = useState({});
  const setRefreshCommentKey = useCommonStore((state) => state.setRefreshCommentKey);

  const fetchCommentDetails = async () => {
    setIsLoading(true);
    try {
      const param = {
        parentId: +commentId,
      };
      const { code, result } = await getCommentListById(param);
      if (code == 200 && result?.parentComment) {
        setComments(result?.comments);
        setCommentDetail(result?.parentComment);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dialog.onClose();
    setRefreshCommentKey();
  };

  useEffect(() => {
    fetchCommentDetails();
  }, []);

  return (
    <MantineModal
      title="Comment"
      width={757}
      maxHeight="80vh"
      {...dialog}
      closeOnClickOutside={false}
      onClose={handleClose}
    >
      {isLoading ? (
        <Center style={{ width: '100%', height: 200 }}>
          <Loader />
        </Center>
      ) : (
        // <LoadingOverlay visible={isLoading} />
        <Container size="xl" my="xl" px={20}>
          <Stack spacing="md">
            <Group align="flex-start" position="apart" noWrap>
              <UserAvatar user={commentDetail.user} size="lg" linkToProfile />
              <Stack justify="center" spacing="xs" sx={{ flex: '1 1 0' }}>
                <Link href={`/user/${commentDetail.user?.id}`} passHref>
                  <Anchor variant="text" size="sm" weight="bold">
                    <Username {...commentDetail?.user} size="md" />
                  </Anchor>
                </Link>
                <Text color="dimmed" size="xs">
                  <DaysFromNow date={commentDetail.createdAt} />
                </Text>
              </Stack>
            </Group>
            <RenderHtml html={commentDetail.content} withMentions cssProps="text-[16px]" />
            {commentDetail.reactions && (
              <ReactionPicker
                className="!bg-transparent"
                contentId={commentDetail.id}
                expressionType={1}
                reactions={commentDetail.reactions}
              />
            )}

            <Title order={2}>{`${comments?.length ?? 0} Comments`}</Title>
            <CommentProvider
              modelId={contentId}
              type={+type}
              getList={getCommentListById}
              paramProp={{ parentId: +commentId }}
            >
              <CommentSection />
            </CommentProvider>
          </Stack>
        </Container>
      )}
    </MantineModal>
  );
}
