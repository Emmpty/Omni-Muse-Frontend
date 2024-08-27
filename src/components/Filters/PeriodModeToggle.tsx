import { Box, BoxProps, Divider, SegmentedControl } from '@mantine/core';
import { useRouter } from 'next/router';
import { IsClient } from '~/components/IsClient/IsClient';
import { PeriodModeType, useFiltersContext, useSetFilters } from '~/providers/FiltersProvider';
import { removeEmpty } from '~/utils/object-helpers';

type Props = {
  type: PeriodModeType;
} & Omit<BoxProps, 'children'>;

const options = [
  { label: 'Stats', value: 'stats' as any },
  { label: 'Published', value: 'published' as any },
];

export function PeriodModeToggle({ type, ...props }: Props) {
  const { query, pathname, replace } = useRouter();
  const globalValue = useFiltersContext((state) => state[type].periodMode);
  const queryValue = query.periodMode as any | undefined;
  const setFilters = useSetFilters(type);

  const value = queryValue ? queryValue : globalValue;
  const setValue = (value: any) => {
    if (queryValue && queryValue !== value)
      replace({ pathname, query: removeEmpty({ ...query, periodMode: undefined }) }, undefined, {
        shallow: true,
      });
    setFilters({ periodMode: value });
  };

  return (
    <IsClient>
      <Box {...props}>
        <Divider label="Mode" labelPosition="center" />
        <SegmentedControl data={options} value={value} onChange={setValue} size="xs" />
      </Box>
    </IsClient>
  );
}
