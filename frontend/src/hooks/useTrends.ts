import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useTrends = () => {
  return useQuery({
    queryKey: ['trends'],
    queryFn: apiService.getTrends,
    staleTime: 60_000,
    retry: 2,
  });
};
