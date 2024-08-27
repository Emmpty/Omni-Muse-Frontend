import { useState, useEffect, useCallback } from 'react';

function useInfiniteQuery(fetchData, apiParams) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetching) return;
    setIsFetching(true);
    try {
      const result = await fetchData({ ...apiParams, page });
      setData((prevData: any) => [...prevData, ...result.data]);
      setHasNextPage(result.hasNextPage);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }, [fetchData, apiParams, page, hasNextPage, isFetching]);

  useEffect(() => {
    setIsLoading(true);
    fetchNextPage();
  }, []); // Only run once on component mount

  return { data, isLoading, fetchNextPage, hasNextPage, isRefetching: isFetching, isFetching };
}

export default useInfiniteQuery;
