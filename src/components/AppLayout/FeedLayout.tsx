import React from 'react';
import { IsClient } from '~/components/IsClient/IsClient';
import { MasonryContainer } from '~/components/MasonryColumns/MasonryContainer';
import { MasonryProvider } from '~/components/MasonryColumns/MasonryProvider';
import { constants } from '~/server/common/constants';
import { ScrollAreaMain } from '~/components/ScrollArea/ScrollAreaMain';

export function FeedLayout({ children }: { children: React.ReactNode }) {
  const maxColumnCount = 7;

  return (
    <ScrollAreaMain>
      <IsClient>
        <MasonryProvider
          columnWidth={constants.cardSizes.model}
          maxColumnCount={maxColumnCount}
          maxSingleColumnWidth={450}
          style={{ margin: 0, flex: 1, zIndex: 10 }}
          pb="md"
        >
          <MasonryContainer>{children}</MasonryContainer>
        </MasonryProvider>
      </IsClient>
    </ScrollAreaMain>
  );
}
