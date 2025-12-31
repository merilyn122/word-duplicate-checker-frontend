import { SimilarityResult, WordFile } from './index';
export type { ReportData } from './index';

export interface GenerateReportRequest {
    targetFileId: number;
    sourceFileIds: number[];
    sensitivity: number;
    reportName?: string;
}