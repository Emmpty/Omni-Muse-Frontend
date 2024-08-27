import React, { createContext, useContext, useState, useCallback } from 'react';
import { getCommentList } from '~/request/api/user/behavior';

type CommentState = {
  comments: any[];
  isLoading: boolean;
  modelId: number | string;
  type: number;
  parentId?: number | string;
  fetchCommentMutation: () => void;
};

// 定义Context
const CommentContext = createContext<CommentState | null>(null);

// Provider组件
export const CommentProvider = ({
  children,
  modelId,
  type,
  paramProp,
  getList = getCommentList,
}: {
  children: React.ReactElement;
  modelId: string | number;
  type: number;
  paramProp?: any;
  getList?: (data: any) => void;
}) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCommentMutation = async () => {
    setIsLoading(true);
    try {
      const param = {
        contentId: modelId,
        type,
        page: 1,
        limit: 999,
      };
      const { code, result } = await getList(paramProp || param);

      if (code == 200 && result.comments) {
        const hierarchicalComments = buildHierarchy(result.comments, paramProp?.parentId || 0);
        setComments(hierarchicalComments);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildHierarchy = (comments: any[], parentId: number | string) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => ({
        ...comment,
        children: buildHierarchy(comments, comment.id),
      }));
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        isLoading,
        fetchCommentMutation,
        modelId,
        type,
        parentId: paramProp?.parentId,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

// 钩子用于在子组件中访问context
export const useComments = () => useContext(CommentContext);
