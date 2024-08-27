import { getRandomInt } from '~/utils/number-helpers';

export type AdFeedItem<T> = { type: 'data'; data: T } | { type: 'ad' };
export type AdFeed<T> = AdFeedItem<T>[];

type AdMatrix = {
  indices: number[];
  lastIndex: number;
};

const adMatrices: Record<string, AdMatrix> = {};

export function createAdFeed<T>({
  data,
  columnCount,
  showAds,
}: {
  data: T[];
  columnCount: number;
  showAds?: boolean;
}): AdFeed<T> {
  const interval =
    adDensity.find(([columns]) => columns === columnCount)?.[1] ??
    adDensity[adDensity.length - 1][1];
  if (!showAds || !interval) return data.map((data) => ({ type: 'data', data }));
  const key = interval.join('_');
  adMatrices[key] = adMatrices[key] ?? { indices: [], lastIndex: 0 };
  const adMatrix = adMatrices[key];

  const [lower, upper] = interval;
  while (adMatrix.lastIndex < data.length) {
    const min = adMatrix.lastIndex + lower + 1;
    const max = adMatrix.lastIndex + upper;
    const index = getRandomInt(min, max);
    adMatrix.indices.push(index);
    adMatrix.lastIndex = index;
  }

  return data.reduce<AdFeed<T>>((acc, item, i) => {
    if (adMatrix.indices.includes(i)) {
      acc.push({ type: 'ad' });
    }
    acc.push({ type: 'data', data: item });
    return acc;
  }, []);
}

type AdDensity = [columns: number, interval: [min: number, max: number]];
const adDensity: AdDensity[] = [
  [1, [6, 10]],
  [2, [7, 12]],
  [3, [8, 14]],
  [4, [9, 15]],
  [5, [10, 14]],
  [6, [12, 15]],
  [7, [14, 20]],
];
