import { ContentClamp } from '~/components/ContentClamp/ContentClamp';
import { RenderHtml } from '~/components/RenderHtml/RenderHtml';
import { DaysFromNow } from '~/components/Dates/DaysFromNow';
import UserAvatar from '~/omnimuse-lib/features/user/UserAvatar';
import { IComment } from '~/request/api/user/behavior.type';
import { IconMessageCircle2 } from '@tabler/icons-react';
import { abbreviateNumber } from '~/utils/number-helpers';
import { useRouter } from 'next/router';
import { triggerRoutedDialog } from '~/components/Dialog/RoutedDialogProvider';
import ReactionPicker from '~/omnimuse-lib/features/common/ReactionPicker/ReactionPicker';

export const CommentDiscussionItem = ({
  data: comment,
  contentId,
  type,
}: {
  data: IComment;
  contentId: string;
  type: number;
}) => {
  const router = useRouter();
  return (
    <div className="border border-solid border-secondaryBorder rounded-lg bg-secondaryBg p-4">
      <div
        onClick={() => {
          router.push(`/user/${comment.user.id}`);
        }}
        className="flex justify-between items-start cursor-pointer"
      >
        <div className="flex items-center gap-[14px]">
          <UserAvatar src={comment.user.image} size="lg" />
          <div className="h-10 flex flex-col justify-center">
            <div className="text-base font-semibold text-defaultText">{comment.user.username}</div>
            <DaysFromNow
              className="text-xs font-normal text-secondaryText"
              date={comment.createdAt}
            />
          </div>
        </div>
      </div>
      <ContentClamp py={24} maxHeight={100}>
        <RenderHtml
          html={comment.content}
          sx={(theme) => ({ fontSize: theme.fontSizes.sm, color: '#fff' })}
          withMentions
        />
      </ContentClamp>
      <div className="flex flex-wrap justify-between items-center text-defaultText">
        <ReactionPicker contentId={comment.id} expressionType={1} reactions={comment.reactions} />
        <div
          onClick={() =>
            triggerRoutedDialog({
              name: 'commentThread',
              state: { commentId: comment.id, contentId, type },
            })
          }
          className="flex items-center gap-0.5 cursor-pointer"
        >
          <IconMessageCircle2 size={12} />
          <span className="text-xs font-medium">
            {abbreviateNumber(comment['_count']['comments'])}
          </span>
        </div>
      </div>
    </div>
  );
};
