import service, { IBaseRes } from '~/request/index';
import {
  AddCommentReq,
  AddExpressionReq,
  GetCommentListReq,
  GetCommentListRes,
} from './behavior.type';

// 获取评论列表
export const getCommentList = (data: GetCommentListReq): IBaseRes<GetCommentListRes> => {
  return service({
    url: `/v1/comment`,
    method: 'post',
    data: data,
  });
};

// 获取某评论的所有下级列表
export const getCommentListById = (data: any): IBaseRes<GetCommentListRes> => {
  return service({
    url: `/v1/comment/reply`,
    method: 'post',
    data: data,
  });
};

// 添加评论
export const addComment = (data: AddCommentReq): IBaseRes<number[]> => {
  return service({
    url: `/v1/user/addcomment`,
    method: 'post',
    data: data,
  });
};

// 添加表情
export const addExpression = (data: AddExpressionReq): IBaseRes<number[]> => {
  return service({
    url: `/v1/user/comment/expression`,
    method: 'post',
    data: data,
  });
};
