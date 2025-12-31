// ./src/api/word.ts
import api from './index';
import { WordFile, SimilarityResult, ReportData, CompareRequest } from '../types';

export const wordAPI = {
    // 获取文件列表
    getFiles: async (): Promise<WordFile[]> => {
        const response = await api.get('/files');
        return response.data;
    },

    // 上传文件
    uploadFile: async (file: File): Promise<WordFile> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // 删除文件
    deleteFile: async (id: number): Promise<void> => {
        await api.delete(`/files/${id}`);
    },

    // 比对文件（接收 CompareRequest 对象）
    compareFiles: async (compareRequest: CompareRequest): Promise<{
        compareResults: SimilarityResult[];
        report: ReportData;
    }> => {
        const response = await api.post('/files/compare', compareRequest);
        return response.data;
    },

    // 获取报告
    getReport: async (reportId: string): Promise<ReportData> => {
        const response = await api.get(`/reports/${reportId}`);
        return response.data;
    },

    // 获取所有报告
    getAllReports: async (): Promise<ReportData[]> => {
        const response = await api.get('/reports');
        return response.data;
    },

    // 删除报告
    deleteReport: async (reportId: string): Promise<void> => {
        await api.delete(`/reports/${reportId}`);
    },
};