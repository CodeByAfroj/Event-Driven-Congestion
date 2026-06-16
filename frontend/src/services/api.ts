import axios from 'axios';
import type { HotspotsResponse, TrendsResponse, PredictRequest, PredictResponse } from '@/types';

const BASE_URL = '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const apiService = {
  healthCheck: async (): Promise<{ message: string }> => {
    const { data } = await api.get('/');
    return data;
  },

  getHotspots: async (): Promise<HotspotsResponse> => {
    const { data } = await api.get('/hotspots');
    return data;
  },

  getTrends: async (): Promise<TrendsResponse> => {
    const { data } = await api.get('/trends');
    return data;
  },

  predict: async (payload: PredictRequest): Promise<PredictResponse> => {
    const { data } = await api.post('/predict', payload);
    return data;
  },
};
