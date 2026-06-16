import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useHotspots = () => {
  return useQuery({
    queryKey: ['hotspots'],
    queryFn: apiService.getHotspots,
    staleTime: 60_000,
    retry: 2,
  });
};
