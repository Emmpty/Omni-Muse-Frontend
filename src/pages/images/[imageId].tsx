import { ImageDetail } from '~/components/Image/Detail/ImageDetail';
import { ImageDetailProvider } from '~/components/Image/Detail/ImageDetailProvider';
import { imagesQueryParamSchema } from '~/components/Image/image.utils';
import { useBrowserRouter } from '~/components/BrowserRouter/BrowserRouterProvider';
import { setPageOptions } from '~/components/AppLayout/AppLayout';

export default function ImagePage() {
  const router = useBrowserRouter();
  const imageId = router.query.imageId;
  const postId = router.query.postId;
  const filters = imagesQueryParamSchema.parse(router.query);

  return (
    <ImageDetailProvider imageId={imageId} postId={postId} filters={filters as any}>
      <ImageDetail />
    </ImageDetailProvider>
  );
}

setPageOptions(ImagePage, { withScrollArea: false });
