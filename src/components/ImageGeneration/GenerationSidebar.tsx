import GenerationTabs from '~/components/ImageGeneration/GenerationTabs';
import { ResizableSidebar } from '~/components/Resizable/ResizableSidebar';
import { useGenerationnnnnStore } from '~/store/generationnnnn.store';

export function GenerationSidebar() {
  const opened = useGenerationnnnnStore((state: any) => state.opened);
  if (!opened) return null;

  return (
    <ResizableSidebar
      name="generation-sidebar334233234234234"
      resizePosition="right"
      minWidth={400}
      maxWidth={800}
      defaultWidth={400}
      style={{ width: '400px !important' }}
    >
      <GenerationTabs />
    </ResizableSidebar>
  );
}
