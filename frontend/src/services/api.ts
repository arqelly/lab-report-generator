import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
    
    getStatistics: async () => {
        const response = await axios.get(`${API_BASE_URL}/statistics`);
        return response.data;
    },
    
    createPlot: async (data: any) => {
        const response = await axios.post(`${API_BASE_URL}/plot`, data);
        return response.data;
    },
    
    generateReport: async (data: any) => {
        const response = await axios.post(`${API_BASE_URL}/generate-report`, data);
        return response.data;
    },
    
    downloadReport: (filename: string) => {
        window.open(`${API_BASE_URL}/download/${filename}`, '_blank');
    },
};