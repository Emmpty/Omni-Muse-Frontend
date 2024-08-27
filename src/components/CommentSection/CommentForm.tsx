import { Stack, Group, Button, createStyles } from '@mantine/core';
import { Form, InputRTE, useForm } from '~/libs/form';
import { useRef, useState } from 'react';
import { showErrorNotification } from '~/utils/notifications';
import { EditorCommandsRef } from '~/components/RichTextEditor/RichTextEditor';
import { useRootThreadContext } from '~/components/CommentsV2/CommentsProvider';
import { addComment } from '~/request/api/user/behavior';
import { z } from 'zod';
import { getSanitizedStringSchema } from '~/server/schema/utils.schema';

export const CommentForm = ({
  comment,
  onCancel,
  onFetchList,
  autoFocus,
  replyTo,
  entityId,
  entityType,
  isFirstComment,
  replyToCommentId,
}: {
  comment?: { id: number; content: string };
  onCancel?: () => void;
  onFetchList?: () => void;
  entityId: number;
  entityType: number;
  autoFocus?: boolean;
  replyTo?: any;
  isFirstComment: boolean;
  replyToCommentId?: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { classes } = useStyles();
  const { expanded, toggleExpanded } = useRootThreadContext();

  const editorRef = useRef<EditorCommandsRef | null>(null);
  const [focused, setFocused] = useState(autoFocus);
  const defaultValues = {
    contentId: entityId,
    type: entityType,
    content: comment?.content,
    parentId: replyToCommentId,
  };
  if (replyTo)
    defaultValues.content = `<span data-type="mention" data-id="mention:${replyTo.id}" data-label="${replyTo.username}" contenteditable="false">@${replyTo.username}</span>&nbsp;`;

  const addCommentSchema = z.object({
    content: getSanitizedStringSchema({
      allowedTags: ['div', 'strong', 'p', 'em', 'u', 's', 'a', 'br'],
    }).refine((data) => {
      return data && data.length > 0 && data !== '<p></p>';
    }, 'Cannot be empty'),
  });

  const form = useForm({
    schema: addCommentSchema,
    defaultValues,
    shouldUnregister: false,
    mode: 'onChange',
  });

  const handleCancel = () => {
    if (!autoFocus) setFocused(false);
    onCancel?.();
    form.reset();
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const param = {
        contentId: entityId,
        type: entityType,
        content: data?.content,
        parentId: replyToCommentId,
      };
      const { code, result } = await addComment(param).finally(() => {
        setIsLoading(false);
        onFetchList?.();
        onCancel?.();
      });
      if (code == 200) {
        form.reset();
      }
    } catch (error) {
      setIsLoading(false);
      showErrorNotification({
        title: 'Could not save comment',
        error: new Error(error.message || 'Could not save comment'),
      });
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit} style={{ flex: 1 }}>
      <Stack>
        <InputRTE
          innerRef={editorRef}
          name="content"
          disabled={isLoading}
          includeControls={['formatting', 'link', 'mentions']}
          hideToolbar
          placeholder={isFirstComment ? 'Enter what you want to say...' : 'Type your comment...'}
          autoFocus={focused}
          onFocus={!autoFocus ? () => setFocused(true) : undefined}
          onSuperEnter={() => form.handleSubmit(handleSubmit)()}
          classNames={{
            content: classes.content,
          }}
        />
        {focused && (
          <Group position="right">
            <Button variant="default" size="xs" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="!text-[#fff]"
              button-type="primary"
              type="submit"
              size="xs"
              loading={isLoading}
              disabled={!form.formState.isDirty}
            >
              Comment
            </Button>
          </Group>
        )}
      </Stack>
    </Form>
  );
};

const useStyles = createStyles((theme) => ({
  content: {
    padding: 0,
    fontSize: 14,

    '.ProseMirror': {
      padding: 10,
      minHeight: 22,
      cursor: 'text',
    },
  },
}));
