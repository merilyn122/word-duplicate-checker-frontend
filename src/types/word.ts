export interface WordFile {
    id: number;
    filename: string;
    originalName: string;
    fileSize: number;
    uploadTime: string;
    uploader: string;
    content?: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    fileId?: number;
}

export interface CompareRequest {
    targetFileId: number;
    sourceFileIds: number[];
    sensitivity: number; // 0-100
}

export interface SimilarityResult {
    sourceFileId: number;
    sourceFileName: string;
    similarity: number; // 0-100
    matchedSegments: Array<{
        text: string;
        position: number;
        length: number;
    }>;
}