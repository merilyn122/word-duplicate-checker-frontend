// ./src/api/report.ts
import api from './index';
import { ReportData } from '../types';

// 注意：CompareRequest 类型应该在 types/index.ts 中定义
interface CompareRequest {
    targetFileId: number;
    sourceFileIds: number[];
    sensitivity: number;
    reportName?: string;
}

export const reportAPI = {
    // 生成报告
    generateReport: async (request: CompareRequest & { reportName?: string }): Promise<ReportData> => {
        const response = await api.post('/reports/generate', request);
        return response.data;
    },

    // 获取报告列表
    getReports: async (): Promise<ReportData[]> => {
        const response = await api.get('/reports');
        return response.data;
    },

    // 获取单个报告
    getReportById: async (reportId: string): Promise<ReportData> => {
        const response = await api.get(`/reports/${reportId}`);
        return response.data;
    },

    // 删除报告
    deleteReport: async (reportId: string): Promise<void> => {
        await api.delete(`/reports/${reportId}`);
    },

    // 下载报告
    downloadReport: async (reportId: string): Promise<Blob> => {
        const response = await api.get(`/reports/${reportId}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },
};