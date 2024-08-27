import { Box, createStyles, List, Stack } from '@mantine/core';
import { useState, useEffect } from 'react';
import { CommentSectionItem } from '~/components/CommentSection/CommentSectionItem';
import { CreateComment } from '~/components/CommentSection/CreateComment';
import { useComments } from '~/components/CommentSection/CommentProvider';
import { NoContent } from '~/components/NoContent/NoContent';

export function CommentSection() {
  const { classes, cx } = useStyles();
  const [replying, setReplying] = useState(false);
  const { comments, modelId, type, parentId, fetchCommentMutation } = useComments() as any;

  useEffect(() => {
    fetchCommentMutation({ contentId: modelId, type, page: 1, limit: 999 });
  }, []);

  const commentCount = comments.length;

  return (
    <Stack spacing="xl">
      <Box>
        <CreateComment
          autoFocus={replying}
          entityId={modelId}
          replyToCommentId={parentId}
          entityType={type}
          onCancel={() => setReplying(false)}
          onFetchList={fetchCommentMutation}
          isFirstComment={commentCount == 0}
        />
      </Box>
      {comments.length > 0 ? (
        <List listStyleType="none" spacing="lg" styles={{ itemWrapper: { width: '100%' } }}>
          {comments.map((comment: any, idx: number) => (
            <List.Item
              key={comment.id}
              className={classes.comment} // 使用计算后的样式
            >
              <CommentSectionItem
                comment={comment}
                type={type}
                modelId={modelId}
                onReplyClick={() => {}}
                depth={0}
                showLine={comment.children.length > 0}
              />
            </List.Item>
          ))}
        </List>
      ) : (
        <NoContent iconSize={60} />
      )}
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  highlightedComment: {
    background: theme.fn.rgba(theme.colors.blue[5], 0.2),
    margin: `-${theme.spacing.xs}px`,
    padding: `${theme.spacing.xs}px`,
  },
  comment: {
    marginTop: `0 !important`, // 这里使用 !important
  },
}));
