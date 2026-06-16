import { useMutation } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import type { PredictRequest } from '@/types';

export const usePredict = () => {
  return useMutation({
    mutationFn: (payload: PredictRequest) => apiService.predict(payload),
  });
};
