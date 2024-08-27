import { getDownloadUrl } from '~/request/api/user/index';
import { useModelStore } from '~/store/model.store';
import { workAccept } from '~/request/api/bounty/index';
import { showErrorNotification, showSuccessNotification } from '~/utils/notifications';
import { useState } from 'react';
import { buyModel } from '~/request/api/model/index';
export const useDownLoadModel = () => {
  const setRefreshModelTotalCountKey = useModelStore((state) => state.setRefreshModelTotalCountKey);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const handleDownload = async (id: number) => {
    const res = await getDownloadUrl({
      type: 'model',
      id,
    });
    if (res.code === 200) {
      setDownloadUrl(res.result?.url);
      setFileName(res.result?.name);
      setRefreshModelTotalCountKey();
      // const fileUrl = res.result?.url;
      // const fileName = res.result?.name;
      // if (fileUrl) {
      //   try {
      //     const link = document.createElement('a');
      //     link.href = fileUrl;
      //     link.download = fileName;
      //     document.body.appendChild(link);
      //     link.click();
      //     link.remove();
      //     window.URL.revokeObjectURL(fileUrl); // Clean up
      //     return true;
      //   } catch (error) {
      //     console.error('Download error:', error);
      //     return false;
      //   }
      // }
    }
    return false;
  };

  return {
    handleDownload,
    downloadUrl,
    fileName,
  };
};

export const useWorkAcceptModel = () => {
  const setRefreshModelTotalCountKey = useModelStore((state) => state.setRefreshModelTotalCountKey);

  const handleWorkAccept = async (id: number) => {
    const res = await workAccept({
      id,
    });
    console.log('handleWorkAccept', res);
    if (res.code === 200) {
      setRefreshModelTotalCountKey();
      showSuccessNotification({
        title: 'hint',
        message: res.message,
      });
      return true;
    } else {
      showErrorNotification({
        title: 'hint',
        error: new Error(res.message),
      });
      return true;
    }
  };
  return {
    handleWorkAccept,
  };
};

export const useBuyModel = () => {
  const setRefreshModelTotalCountKey = useModelStore((state) => state.setRefreshModelTotalCountKey);

  const handleBuyModel = async (data: any) => {
    const res = await buyModel(data);
    if (res.code === 200) {
      setRefreshModelTotalCountKey();
      showSuccessNotification({
        title: 'hint',
        message: res.message,
      });
      return true;
    } else {
      showErrorNotification({
        title: 'hint',
        error: new Error(res.message),
      });
      return true;
    }
  };
  return {
    handleBuyModel,
  };
};
