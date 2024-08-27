import { Group, Modal, Stack, LoadingOverlay } from '@mantine/core';
import XButton from '~/omnimuse-lib/components/XButton';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { getSanitizedStringSchema } from '~/server/schema/utils.schema';
import { useDialogContext } from '~/components/Dialog/DialogProvider';

import { useCatchNavigation } from '~/hooks/useCatchNavigation';
import { Form, InputRTE, useForm } from '~/libs/form';
import { showErrorNotification } from '~/utils/notifications';
import { useCommonStore } from '~/store/common.store';
import { addComment } from '~/request/api/user/behavior';
import { CommentType } from '~/request/api/user/behavior.type';

export type CommentUpsertInput = z.infer<typeof commentUpsertInput>;
export const commentUpsertInput = z.object({
  commentId: z.number().nullish(),
  content: getSanitizedStringSchema({
    allowedTags: ['div', 'strong', 'p', 'em', 'u', 's', 'a', 'br'],
  }).refine((data) => {
    return data && data.length > 0 && data !== '<p></p>';
  }, 'Cannot be empty'),
});

export default function CommentEditModal({
  contentId,
  type,
  commentId,
}: {
  contentId: string;
  type: CommentType;
  commentId?: number;
}) {
  commentId = Number(commentId);
  type = Number(type) as CommentType;
  const dialog = useDialogContext();

  const [value, , removeValue] = useLocalStorage<string | undefined>({
    key: 'commentContent',
    defaultValue: undefined,
  });
  const setRefreshCommentKey = useCommonStore((state) => state.setRefreshCommentKey);
  const [initialContent, setInitialContent] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const loadingComment = isLoading && !!commentId;

  const form = useForm({
    schema: commentUpsertInput,
    defaultValues: { commentId, content: initialContent ?? '' },
    shouldUnregister: false,
  });

  const { isDirty, isSubmitted } = form.formState;
  useCatchNavigation({ unsavedChanges: isDirty && !isSubmitted });

  const handleSaveComment = async (values: z.infer<typeof commentUpsertInput>) => {
    values.content = values.content?.trim() ?? '';
    if (values.content) {
      setIsLoading(true);
      const { content } = values;
      addComment({ content, contentId, type }).then((res) => {
        if (res.code === 200) {
          handleClose();
          setRefreshCommentKey();
        } else {
          showErrorNotification({
            error: new Error(res.message),
            title: 'Could not save the comment',
          });
        }
      });
    }
  };

  const handleClose = () => {
    form.reset({ commentId, content: undefined });
    dialog.onClose();
  };

  useEffect(() => {
    if (data && !loadingComment) form.reset(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loadingComment]);

  useEffect(() => {
    if (!initialContent && value) {
      setInitialContent(value);
      form.reset({ commentId, content: value });
      removeValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent, removeValue, value]);

  return (
    <Modal
      opened={dialog.opened}
      onClose={dialog.onClose}
      title={commentId ? 'Editing comment' : 'Add a comment'}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <LoadingOverlay visible={loadingComment} />
      <Form form={form} onSubmit={handleSaveComment}>
        <Stack spacing="md">
          <InputRTE
            name="content"
            placeholder="Type your thoughts..."
            includeControls={['formatting', 'link', 'mentions']}
            editorSize="xl"
            onSuperEnter={() => form.handleSubmit(handleSaveComment)()}
          />
          <Group position="apart">
            <XButton size="sm" onClick={handleClose}>
              Cancel
            </XButton>
            <XButton size="sm" type="primary" loading={isLoading}>
              {!!commentId ? 'Save' : 'Comment'}
            </XButton>
          </Group>
        </Stack>
      </Form>
    </Modal>
  );
}
