import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getOrchestratorMediaFilesFromUrls } from '~/utils/orchestration';

const useOrchestratorUrlStore = create<{
  data: Record<string, string[]>;
  setData: (key: string, urls: string[]) => void;
  getData: (key: string) => string[];
}>()(
  immer((set, get) => ({
    data: {},
    setData: (key, urls) =>
      set((state) => {
        state.data[key] = urls.filter((url) => url.startsWith('https://orchestration.civitai.com'));
      }),
    getData: (key) => {
      const urls = get().data[key];
      set((state) => {
        delete state.data[key];
      });
      return urls;
    },
  }))
);

export const orchestratorMediaTransmitter = {
  setUrls: useOrchestratorUrlStore.getState().setData,
  getFiles: async (key: string) => {
    const urls = useOrchestratorUrlStore.getState().getData(key) ?? [];
    return await getOrchestratorMediaFilesFromUrls(urls);
  },
};
