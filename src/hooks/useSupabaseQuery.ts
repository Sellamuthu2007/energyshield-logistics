import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export function useSupabaseQuery<TData>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    retry: 2, // Auto retry on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}
export default useSupabaseQuery;
