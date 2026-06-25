import axios from 'axios';

import type {
  ReportRequest,
  ReportResponse,
} from '../types';


const API_ORIGIN = 'http://localhost:8000';
const API_BASE_URL = `${API_ORIGIN}/api`;


export const api = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_BASE_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  getStatistics: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/statistics`
    );

    return response.data;
  },

  createPlot: async (data: unknown) => {
    const response = await axios.post(
      `${API_BASE_URL}/plot`,
      data
    );

    return response.data;
  },

  generateReport: async (
    data: ReportRequest
  ): Promise<ReportResponse> => {
    const response = await axios.post<ReportResponse>(
      `${API_BASE_URL}/generate-report`,
      data
    );

    return response.data;
  },

  downloadReport: (downloadUrl: string) => {
    const fullUrl = new URL(downloadUrl, API_ORIGIN);

    window.open(
      fullUrl.toString(),
      '_blank',
      'noopener,noreferrer'
    );
  },
};

