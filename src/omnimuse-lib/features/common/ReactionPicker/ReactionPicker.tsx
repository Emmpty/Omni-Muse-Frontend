import { IconPlus } from '@tabler/icons-react';
import React, { useMemo, useState } from 'react';
import { addExpression } from '~/request/api/user/behavior';
import { ExpressionType, TReactions } from '~/request/api/user/behavior.type';

interface EmoItem {
  emo: string;
  key: keyof TReactions;
  count: number;
  status: boolean;
  className: string;
}

interface ReactionPickerProps {
  reactions: TReactions;
  contentId: string | number;
  expressionType: ExpressionType;
  className?: string;
}

const ReactionPicker = ({
  reactions,
  contentId,
  expressionType,
  className,
}: ReactionPickerProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reactionsCache, setReactionsCache] = useState(reactions);
  const emoList: EmoItem[] = useMemo(() => {
    return [
      {
        emo: '👍',
        key: 'like',
        count: reactionsCache.like.count,
        status: reactionsCache.like.status,
        className: open || reactionsCache.like.count > 0 ? 'flex' : 'hidden',
      },
      {
        emo: '👎',
        key: 'dislike',
        count: reactionsCache.dislike.count,
        status: reactionsCache.dislike.status,
        className: open || reactionsCache.dislike.count > 0 ? 'flex' : 'hidden',
      },
      {
        emo: '❤️',
        key: 'heart',
        count: reactionsCache.heart.count,
        status: reactionsCache.heart.status,
        className: open || reactionsCache.heart.count > 0 ? 'flex' : 'hidden',
      },
      {
        emo: '😂',
        key: 'laugh',
        count: reactionsCache.laugh.count,
        status: reactionsCache.laugh.status,
        className: open || reactionsCache.laugh.count > 0 ? 'flex' : 'hidden',
      },
      {
        emo: '😢',
        key: 'cry',
        count: reactionsCache.cry.count,
        status: reactionsCache.cry.status,
        className: open || reactionsCache.cry.count > 0 ? 'flex' : 'hidden',
      },
    ];
  }, [open, reactionsCache]);
  const showOpenBox = useMemo(() => {
    return (
      reactionsCache.like.count <= 0 ||
      reactionsCache.dislike.count <= 0 ||
      reactionsCache.heart.count <= 0 ||
      reactionsCache.laugh.count <= 0 ||
      reactionsCache.cry.count <= 0
    );
  }, [reactionsCache]);

  const handleReaction = async (item: EmoItem) => {
    if (loading) return;
    setLoading(true);
    // 调接口
    const res = await addExpression({
      contentId: String(contentId),
      expression: item.key,
      type: expressionType,
      operation: !reactionsCache[item.key].status,
    }).finally(() => {
      setLoading(false);
    });
    if (res.code === 200) {
      setReactionsCache({
        ...reactionsCache,
        ...{
          [item.key]: {
            status: !reactionsCache[item.key].status,
            count: reactionsCache[item.key].status
              ? reactionsCache[item.key].count - 1
              : reactionsCache[item.key].count + 1,
          },
        },
      });
    }
  };
  return (
    <div
      className={`rounded-2xl h-5 px-2 text-xs leading-3 font-medium flex items-center gap-2 bg-cardOperateBg cursor-pointer ${className}`}
    >
      <button
        className={`${showOpenBox ? 'flex' : 'hidden'} items-center x-button`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(!open);
        }}
      >
        <IconPlus size={12} stroke={3} />
        😊
      </button>
      {emoList.map((item) => {
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleReaction(item);
            }}
            key={item.key}
            className={`items-center gap-0.5 x-button ${item.className} ${
              item.status ? 'text-activeText' : ''
            }`}
          >
            <div>{item.emo}</div>
            <div>{item.count}</div>
          </button>
        );
      })}
    </div>
  );
};

export default ReactionPicker;
