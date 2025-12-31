// ./src/types/index.ts

// Word文件类型
export interface WordFile {
    id: number;
    filename: string;
    originalName: string;
    fileSize: number;
    uploadTime: string;
    uploader: string;
    content?: string;
    path?: string;
}

// 比对请求类型
export interface CompareRequest {
    targetFileId: number;
    sourceFileIds: number[];
    sensitivity: number; // 0-100
}

// 相似度结果类型
export interface SimilarityResult {
    sourceFileId: number;
    sourceFileName: string;
    similarity: number; // 0-100
    matchedSegments: Array<{
        text: string;
        position: number;
        length: number;
    }>;
    targetFile?: any;
    compareFile?: any;
    matchedSections?: Array<any>;
}

// 报告数据类型
export interface ReportData {
    id: string;
    reportId: string;
    reportName?: string;
    generateDate: string;
    targetFile: WordFile;
    compareFiles: WordFile[];
    results: SimilarityResult[];
    overallSimilarity: number;
    status: 'pending' | 'completed' | 'failed';
}

// 如果需要，可以再导出其他类型，比如上传响应
export interface UploadResponse {
    success: boolean;
    message: string;
    fileId?: number;
}


export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}