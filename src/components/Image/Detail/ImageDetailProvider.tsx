import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { ImageGuardConnect } from '~/components/ImageGuard/ImageGuard2';
import { ReviewReactions } from '~/types/prisma/schema';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useBrowserRouter } from '~/components/BrowserRouter/BrowserRouterProvider';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useHasClientHistory } from '~/store/ClientHistoryStore';
import { ImageGetById, ImageGetInfinite } from '~/types/router';
import { QS } from '~/utils/qs';
import { removeEmpty } from '../../../utils/object-helpers';
import { fetchGalleDetailsByPostId, fetchGalleDetailsByImageId } from '~/request/api/model';
import { likeModel, collectModel, fetchUserLickAndCcollectModel } from '~/request/api/user/index';
import { useUserStore } from '~/store/user.store';
import { useModelStore } from '~/store/model.store';

type ImageDetailState = {
  images: ImageGetInfinite;
  image?: ImageGetInfinite[number] | ImageGetById;
  isLoading: boolean;
  active: boolean;
  connect: ImageGuardConnect;
  isMod?: boolean;
  isOwner?: boolean;
  shareUrl: string;
  canNavigate?: boolean;
  likeData?: object;
  toggleInfo: () => void;
  close: () => void;
  next: () => void;
  previous: () => void;
  handleLike: () => void;
  handleCollect: () => void;
  navigate: (id: number) => void;
};

const ImageDetailContext = createContext<ImageDetailState | null>(null);
export const useImageDetailContext = () => {
  const context = useContext(ImageDetailContext);
  if (!context) throw new Error('useImageDetailContext not found in tree');
  return context;
};

export function ImageDetailProvider({
  children,
  imageId,
  postId,
  images: initialImages = [],
  hideReactionCount,
  filters,
}: {
  children: React.ReactElement;
  imageId: number;
  postId: string;
  images?: any[];
  hideReactionCount?: boolean;
  filters: {
    postId?: string;
    modelId?: number;
    modelVersionId?: number;
    username?: string;
    limit?: number;
    prioritizedUserIds?: number[];
    tags?: number[];
    reactions?: ReviewReactions[];
    collectionId?: number;
  } & Record<string, unknown>;
}) {
  const currentUser = useUserStore((state) => state.userInfo);
  const isMobile = useIsMobile();
  const [active, setActive] = useLocalStorage({
    key: `image-detail-open`,
    defaultValue: true,
  });

  const router = useRouter();
  const browserRouter = useBrowserRouter();
  const hasHistory = useHasClientHistory();
  const [imageLoading, setImageLoading] = useState(true);
  const [likeData, setLikeData] = useState({
    likestatus: false,
    collectstatus: false,
  });
  const [images, setImages] = useState([]);

  const { postId: queryPostId, imageId: queryImageId } = browserRouter.query;
  const { modelId, modelVersionId, username, reactions, postId: filterPostId } = filters;
  const postIdStr = (postId || queryPostId || filterPostId)?.toString();
  const imageIdStr = imageId || queryImageId;
  const refreshModelTotalCountKey = useModelStore((state) => state.refreshModelTotalCountKey);

  useEffect(() => {
    if (postIdStr) {
      getGalleryDetailsByPostId();
    }
    if (imageIdStr) {
      getGalleryDetailsByImageId();
    }
  }, [refreshModelTotalCountKey]);

  useEffect(() => {
    if (postIdStr) {
      browserRouter.replace(
        {
          query: removeEmpty({
            ...browserRouter.query,
            postId: postIdStr.toString(),
            imageId: imageIdStr,
          }),
        },
        `/images/${imageIdStr}?postId=${postIdStr.toString()}`
      );
    } else if (imageIdStr) {
      browserRouter.replace(
        {
          query: removeEmpty({
            ...browserRouter.query,
            imageId: imageIdStr,
          }),
        },
        `/images/${imageIdStr}`
      );
      getGalleryDetailsByImageId();
    }
    getUserLikeAndCcollect();
  }, [imageIdStr]);

  useEffect(() => {
    postIdStr && getGalleryDetailsByPostId();
  }, [postIdStr]);

  const image = useMemo(
    () => images.find((x: any) => x.id == imageIdStr) || {},
    [images, imageIdStr]
  );
  const index = useMemo(() => images.findIndex((x: any) => x.id == imageIdStr), [image]);
  const prevIndex = useMemo(() => index - 1, [index]);
  const nextIndex = useMemo(() => index + 1, [index]);
  const canNavigate = useMemo(
    () => (index > -1 ? images.length > 1 : images.length > 0),
    [index, images]
  );

  useEffect(() => {
    if (isMobile && active) {
      setActive(false);
    }
  }, [isMobile]);

  // #region [data fetching]
  const getGalleryDetailsByPostId = async () => {
    if (!postIdStr) return;
    setImageLoading(true);
    try {
      const { code, result } = await fetchGalleDetailsByPostId(postIdStr).finally(() => {
        setImageLoading(false);
      });
      if (code === 200 && result.items) {
        const imgList = result.items.images || [];
        setImages(imgList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getGalleryDetailsByImageId = async () => {
    if (!imageIdStr) return;
    setImageLoading(true);
    try {
      const { code, result } = await fetchGalleDetailsByImageId(imageIdStr).finally(() => {
        setImageLoading(false);
      });
      if (code === 200 && result.items) {
        const imgList = result.items.images || [];
        setImages(imgList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUserLikeAndCcollect = async () => {
    try {
      const { code, result } = await fetchUserLickAndCcollectModel({
        contentId: imageIdStr,
        type: 2,
      });
      if (code === 200 && result) {
        setLikeData(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // #region [back button functionality]
  const close = () => {
    if (hasHistory) browserRouter.back();
    else {
      const [, queryString] = browserRouter.asPath.split('?');
      const { active, ...query } = QS.parse(queryString) as any;

      if (active) browserRouter.replace({ query: browserRouter.query }, { query });
      else {
        const returnUrl = postIdStr
          ? getReturnUrl({ postId: postIdStr, modelId, modelVersionId, username }) ?? '/images'
          : `/user/${currentUser?.id}/image`;
        router.push(returnUrl, undefined, { shallow: true });
      }
    }
  };

  useHotkeys([['Escape', close]]);

  // #region [info toggle]
  const toggleInfo = () => {
    setActive(!active);
  };
  // #endregion

  // #region [navigation]
  /**NOTES**
  - when our current image is not found in the images array, we can navigate away from it, but we can't use the arrows to navigate back to it.
*/

  const navigate = (id: number) => {
    const query = browserRouter.query;
    const [, queryString] = browserRouter.asPath.split('?');
    browserRouter.replace(
      { query: { ...query, imageId: id } },
      {
        pathname: `/images/${id}`,
        query: QS.parse(queryString) as any,
      }
    );
  };

  const previous = () => {
    if (canNavigate) {
      const id = prevIndex > -1 ? images[prevIndex]?.id : images[images.length - 1]?.id;
      navigate(id);
    }
  };

  const next = () => {
    if (canNavigate) {
      const id = nextIndex < images.length ? images[nextIndex]?.id : images[0]?.id;
      navigate(id);
    }
  };

  const handleLike = async () => {
    try {
      const { code, result } = await likeModel({
        contentId: imageIdStr,
        type: 2,
        operation: !likeData.likestatus,
      });
      setLikeData((prevState) => ({
        ...prevState,
        likestatus: !prevState.likestatus,
      }));
      if (code == 200) {
      }
    } catch (error) {
      console.error('点赞失败', error);
    }
  };

  const handleCollect = async () => {
    try {
      const { code, result } = await collectModel({
        contentId: imageIdStr,
        type: 2,
        operation: !likeData.collectstatus,
      });
      setLikeData((prevState) => ({
        ...prevState,
        collectstatus: !prevState.collectstatus,
      }));
      if (code == 200) {
      }
    } catch (error) {
      console.error('收藏失败', error);
    }
  };

  // #endregion

  const shareUrl = useMemo(() => {
    const [pathname, queryString] = browserRouter.asPath.split('?');
    const { active, ...query } = QS.parse(queryString);
    return Object.keys(query).length > 0 ? `${pathname}?${QS.stringify(query)}` : pathname;
  }, [browserRouter]);

  const isMod = currentUser?.isModerator ?? false;
  const isOwner = currentUser?.id === image?.user?.id;

  const connect: ImageGuardConnect = modelId
    ? { connectType: 'model', connectId: modelId }
    : postIdStr
    ? { connectType: 'post', connectId: postIdStr }
    : username
    ? { connectType: 'user', connectId: username }
    : ({} as any);

  return (
    <ImageDetailContext.Provider
      value={{
        images,
        image,
        isLoading: imageLoading,
        active,
        connect,
        toggleInfo,
        close,
        next,
        previous,
        handleLike,
        handleCollect,
        isOwner,
        isMod,
        shareUrl,
        canNavigate,
        navigate,
        likeData,
      }}
    >
      {children}
    </ImageDetailContext.Provider>
  );
}

const getReturnUrl = ({
  postId,
  modelId,
  modelVersionId,
  username,
}: {
  postId?: string | number;
  modelId?: number;
  modelVersionId?: number;
  username?: string;
}) => {
  if (modelId) {
    const url = `/models/${modelId}`;
    return modelVersionId ? `${url}?modelVersionId=${modelVersionId}` : url;
  }
  // else if (postId) {
  //   return `/posts/${postId}`;
  // } else if (username) {
  //   return `/user/${username}/images`;
  // }
};
