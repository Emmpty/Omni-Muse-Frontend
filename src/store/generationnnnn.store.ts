import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
export const useGenerationnnnnStore: any = create<any>()(
  immer((set, get): any => ({
    // 开关
    opened: false,
    // 默认加载的版本模型
    defaultModelVersionId: '',
    // 根据任务id 默认加载的生成信息
    defaultTaskId: '',
    // 根据图片id 默认加载的生成信息
    defaultImageId: '',
    // 生成之后, 用于监听刷新
    afterGenerated: 0,
    open: (idStr?: string) =>
      set((state: any) => {
        state.opened = true;
      }),
    setModelVersionId: (idStr?: string) =>
      set((state: any) => {
        state.defaultModelVersionId = idStr || '';
      }),
    setTaskId: (idStr?: string) =>
      set((state: any) => {
        state.defaultTaskId = idStr || '';
      }),
    setImageId: (idStr?: string) =>
      set((state: any) => {
        state.defaultImageId = idStr || '';
      }),
    close: () =>
      set((state: any) => {
        state.opened = false;
        state.defaultModelVersionId = '';
        state.defaultTaskId = '';
        state.defaultImageId = '';
      }),
    onAfterGenerated: () =>
      set((state: any) => {
        state.afterGenerated = state.afterGenerated + 1;
      }),
  }))
);

// export const useGenerationnnnnStore = _store.getState();
// export const _useGenerationnnnnStore = _store;
