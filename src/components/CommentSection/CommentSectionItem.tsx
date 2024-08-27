import { Anchor, Badge, Group, Stack, Text, Button, createStyles, Box } from '@mantine/core';
import { IconBrandMessenger } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { DaysFromNow } from '~/components/Dates/DaysFromNow';
import { RenderHtml } from '~/components/RenderHtml/RenderHtml';
import { Username } from '~/components/User/Username';
import { UserAvatar } from '~/components/UserAvatar/UserAvatar';
import { CreateComment } from '~/components/CommentSection/CreateComment';
import { useComments } from '~/components/CommentSection/CommentProvider';
import ReactionPicker from '~/omnimuse-lib/features/common/ReactionPicker/ReactionPicker';

type CommentSectionItemProps = {
  comment: any;
  modelId: number;
  type: number;
  showLine: boolean;
  depth: number;
  onReplyClick?: () => void;
};

export function CommentSectionItem({
  comment,
  modelId,
  showLine,
  onReplyClick,
  type,
  depth = 0,
}: CommentSectionItemProps) {
  const [replying, setReplying] = useState(false);

  const indentSize = type != 2 ? (depth ? 40 : 0) : depth ? 30 : 0; // Indent size for child comments
  const marginTop = type != 2 ? 20 : 10;
  const { classes } = useStyles();
  const { fetchCommentMutation } = useComments() as any;

  // 如果添加接口返回刚刚添加的数据可以在这里插入
  // const handleFetchList = () => {
  //   comment.children.push({
  //     id: 888,
  //     createdAt: '2024-04-22T10:47:44.023419Z',
  //     nsfw: false,
  //     content: '<p>1-3评论</p>',
  //     contentId: 1782727819562848300,
  //     parentId: 0,
  //     locked: false,
  //     tosViolation: false,
  //     hidden: false,
  //     user: {
  //       id: 11,
  //       username: '测试1234444',
  //       deletedAt: null,
  //       image: 'https://api.omnimuse.ai/v1/assets/avatar/7cd5b300f462baecaa80ab47840d24ec.jpg',
  //       profilePicture: '',
  //       cosmetics: null,
  //     },
  //     reactions: {
  //       like: 0,
  //       dislike: 0,
  //       heart: 0,
  //       laugh: 0,
  //       cry: 0,
  //     },
  //     contentName: '测试赛事',
  //     _count: {
  //       comments: 0,
  //     },
  //     children: [],
  //   });
  // };
  return (
    <div
      className={`${showLine ? (type != 2 ? classes.withLine : classes.withLineSm) : ''} ${
        classes.commentItems
      }`}
      style={{ marginLeft: `${indentSize}px`, marginTop: `${marginTop}px` }}
    >
      <Group align="flex-start" position="apart" noWrap>
        <UserAvatar user={comment?.user} size={type == 2 ? 'sm' : 'md'} linkToProfile />
        <Stack spacing="xs" sx={{ flex: '1 1 0' }}>
          <Stack spacing={0}>
            <Group spacing={8} align="center">
              {!comment?.user?.deletedAt ? (
                <Link href={`/user/${comment?.user?.id}`} passHref>
                  <Anchor variant="text" size="sm" weight="bold">
                    <Username {...comment?.user} size="md" />
                  </Anchor>
                </Link>
              ) : (
                <Username {...comment?.user} />
              )}
              {comment?.user?.id === modelId ? (
                <Badge color="violet" size="xs">
                  OP
                </Badge>
              ) : null}
              <Text color="dimmed" size="xs">
                <DaysFromNow date={comment?.createdAt} />
              </Text>
            </Group>
          </Stack>
          <RenderHtml html={comment.content} withMentions cssProps="text-[14px]" />

          <Group spacing={4}>
            {/* <ReactionPicker
              reactions={reactions}
              onSelect={(reaction) => toggleReactionMutation.mutate({ id: comment.id, reaction })}
            /> */}
            {/* {currentUser && !isOwner && !comment.locked && !isMuted && ( */}
            <ReactionPicker
              className="!bg-transparent"
              contentId={comment.id}
              expressionType={1}
              reactions={comment.reactions}
            />
            <Button
              variant="subtle"
              size="xs"
              radius="xl"
              onClick={() => setReplying(true)}
              compact
            >
              <Group spacing={4}>
                <IconBrandMessenger size={14} />
                Reply
              </Group>
            </Button>
            {/* )} */}
          </Group>
          {/* {isOwner && (
            <Button size="xs" onClick={() => setEditComment(comment)}>
              Edit
            </Button>
          )} */}
        </Stack>
      </Group>
      {replying && (
        <Box pt="sm">
          <CreateComment
            autoFocus
            entityId={modelId}
            entityType={type}
            onCancel={() => setReplying(false)}
            onFetchList={fetchCommentMutation}
            replyToCommentId={comment.id}
            className={classes.replyInset}
            isFirstComment={comment.children.length == 0}
          />
        </Box>
      )}
      {/* <ContentClamp maxHeight={300}> */}
      {/* Recursively render child comments */}
      {comment.children &&
        comment.children.map((childComment: any) => (
          <CommentSectionItem
            key={childComment.id}
            comment={childComment}
            modelId={modelId}
            type={type}
            onReplyClick={onReplyClick}
            depth={depth + 1}
            showLine={childComment.children.length > 0}
          />
        ))}
      {/* </ContentClamp> */}
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  commentItems: {
    position: 'relative',
  },
  withLine: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '60px',
      bottom: 0,
      left: '17px',
      width: '1px', // 线条宽度
      backgroundColor: '#2D2D2D', // 线条颜色
    },
  },
  withLineSm: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '40px',
      bottom: 0,
      left: '13px',
      width: '1px', // 线条宽度
      backgroundColor: '#2D2D2D', // 线条颜色
    },
  },
  replyInset: {
    // Size of the image / 2, minus the size of the border / 2
    marginLeft: '40px',
  },
}));
