import React, { useState } from 'react';
import { Upload, Button, message, Card, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { wordAPI } from '../../api/word';

const { Dragger } = Upload;

interface UploadSectionProps {
    onUploadSuccess?: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = async (file: File) => {
        setUploading(true);
        setProgress(0);

        try {
            // 模拟进度
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            await wordAPI.uploadFile(file);

            clearInterval(progressInterval);
            setProgress(100);
            message.success(`${file.name} 上传成功`);
            onUploadSuccess?.();
        } catch (error) {
            message.error('上传失败');
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        accept: '.doc,.docx',
        showUploadList: false,
        customRequest: ({ file }) => {
            handleUpload(file as File);
        },
        beforeUpload: (file) => {
            const isWord = file.type === 'application/msword' ||
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.name.endsWith('.doc') ||
                file.name.endsWith('.docx');

            if (!isWord) {
                message.error('只能上传 Word 文档!');
                return false;
            }

            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                message.error('文件大小不能超过 10MB!');
                return false;
            }

            return true;
        },
    };

    return (
        <Card title="上传 Word 文件" style={{ marginBottom: 16 }}>
            <Dragger {...props} disabled={uploading}>
                <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
                <p className="ant-upload-hint">
                    支持 .doc 和 .docx 格式，单个文件不超过 10MB
                </p>
            </Dragger>

            {uploading && (
                <div style={{ marginTop: 16 }}>
                    <Progress percent={progress} />
                </div>
            )}
        </Card>
    );
};

export default UploadSection;