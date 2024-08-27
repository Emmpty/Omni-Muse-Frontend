import { ModalProps } from '@mantine/core';
import { ContextModalProps, ModalsProvider } from '@mantine/modals';
import dynamic from 'next/dynamic';
import { openReportModal } from '~/components/Modals/ReportModal';
import { openRunStrategyModal } from '~/components/Modals/RunStrategyModal';
const ReportModal = dynamic(() => import('~/components/Modals/ReportModal'));
const RunStrategyModal = dynamic(() => import('~/components/Modals/RunStrategyModal'));

const ResourceSelectModal = dynamic(
  () => import('~/components/ImageGeneration/GenerationForm/ResourceSelectModal')
);
const BoostModal = dynamic(() => import('~/components/ImageGeneration/BoostModal'));

const registry = {
  report: {
    Component: ReportModal,
    fn: openReportModal,
  },
  runStrategy: {
    Component: RunStrategyModal,
    fn: openRunStrategyModal,
  },
};

export const CustomModalsProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO.briant - fix the scrolling this was causing...
  // const handlePopState = () => {
  //   if (!location.href.includes('#')) {
  //     closeAllModals();
  //   }
  // };
  // useWindowEvent('popstate', handlePopState);

  return (
    <ModalsProvider
      labels={{
        confirm: 'Confirm',
        cancel: 'Cancel',
      }}
      modals={
        {
          resourceSelectModal: ResourceSelectModal,
          boostModal: BoostModal,
          ...(Object.keys(registry) as Array<keyof typeof registry>).reduce<any>((acc, key) => {
            acc[key] = registry[key].Component;
            return acc;
          }, {}),
        } as Record<string, React.FC<ContextModalProps<any>>> //eslint-disable-line
      }
      // Setting zIndex so confirm modals popup above everything else
      modalProps={{
        zIndex: 300,
      }}
    >
      {children}
    </ModalsProvider>
  );
};

export function openContext<TName extends keyof typeof registry>(
  modal: TName,
  props: Parameters<(typeof registry)[TName]['fn']>[0],
  modalProps?: Omit<ModalProps, 'opened' | 'onClose'>
) {
  registry[modal].fn(props as any, modalProps);
}
