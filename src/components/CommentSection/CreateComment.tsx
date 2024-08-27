import { Alert, Center, Group, Text } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useRouter } from 'next/router';
import { CommentForm } from './CommentForm';
import { UserAvatar } from '~/components/UserAvatar/UserAvatar';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { useCommentsContext } from '~/components/CommentsV2/CommentsProvider';
import { IconLock } from '@tabler/icons-react';

type CreateCommentProps = {
  onCancel?: () => void;
  autoFocus?: boolean;
  entityId: number;
  entityType: number;
  replyToCommentId?: number;
  className?: string;
  onFetchList?: () => void;
  isFirstComment: boolean;
};

export function CreateComment({
  onCancel,
  onFetchList,
  autoFocus,
  replyToCommentId,
  isFirstComment,
  entityId,
  entityType,
  className,
}: CreateCommentProps) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { isLocked, isMuted, forceLocked } = useCommentsContext();

  if (!currentUser)
    return (
      <Alert color="primary.2">
        <Group align="center" position="center" spacing="xs">
          <Text size="sm">
            You must{' '}
            <Text
              color="primary.2"
              variant="link"
              component={NextLink}
              href={`/login?returnUrl=${router.asPath}`}
              rel="nofollow"
              inline
            >
              sign in
            </Text>{' '}
            to add a comment
          </Text>
        </Group>
      </Alert>
    );

  if (forceLocked) {
    return (
      <Alert color="primary.2">
        <Center>You do not have permissions to add comments.</Center>
      </Alert>
    );
  }

  if (isLocked || isMuted)
    return (
      <Alert color="primary.2" icon={<IconLock />}>
        <Center>
          {isMuted
            ? 'You cannot add comments because you have been muted'
            : 'This thread has been locked'}
        </Center>
      </Alert>
    );

  return (
    <Group align="flex-start" noWrap spacing="sm" className={className}>
      {entityType != 2 && <UserAvatar user={currentUser} size={entityType == 2 ? 'sm' : 'md'} />}
      <CommentForm
        entityId={entityId}
        entityType={entityType}
        onCancel={onCancel}
        onFetchList={onFetchList}
        autoFocus={autoFocus}
        isFirstComment
        replyToCommentId={replyToCommentId}
      />
    </Group>
  );
}
