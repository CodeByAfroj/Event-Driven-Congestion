import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: apiService.healthCheck,
    staleTime: 30_000,
    retry: 1,
  });
};
