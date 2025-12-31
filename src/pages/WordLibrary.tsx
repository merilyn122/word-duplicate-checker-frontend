import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Upload,
    message,
    Modal,
    Tag,
    Popconfirm,
    Typography,
    Input,
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    DownloadOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { wordAPI } from '../api/word';
import { WordFile } from '../types';

const { Title } = Typography;
const { Search } = Input;

const WordLibrary: React.FC = () => {
    const [files, setFiles] = useState<WordFile[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<WordFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<WordFile | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const data = await wordAPI.getFiles();
            setFiles(data);
            setFilteredFiles(data);
        } catch (error) {
            message.error('加载文件失败');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file: File) => {
        try {
            const result = await wordAPI.uploadFile(file);
            message.success(`${file.name} 上传成功`);
            loadFiles(); // 重新加载文件列表
            return false; // 阻止默认上传行为
        } catch (error) {
            message.error('上传失败');
            return false;
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await wordAPI.deleteFile(id);
            message.success('删除成功');
            loadFiles();
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handlePreview = (file: WordFile) => {
        setSelectedFile(file);
        setPreviewVisible(true);
    };

    const handleSearch = (value: string) => {
        if (!value.trim()) {
            setFilteredFiles(files);
            return;
        }

        const filtered = files.filter(file =>
            file.originalName.toLowerCase().includes(value.toLowerCase()) ||
            file.uploader.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredFiles(filtered);
    };

    const columns = [
        {
            title: '文件名',
            dataIndex: 'originalName',
            key: 'originalName',
            width: '30%',
            render: (text: string, record: WordFile) => (
                <Button type="link" onClick={() => handlePreview(record)}>
                    {text}
                </Button>
            ),
        },
        {
            title: '大小',
            dataIndex: 'fileSize',
            key: 'fileSize',
            width: '15%',
            render: (size: number) => `${(size / 1024).toFixed(2)} KB`,
        },
        {
            title: '上传者',
            dataIndex: 'uploader',
            key: 'uploader',
            width: '15%',
        },
        {
            title: '上传时间',
            dataIndex: 'uploadTime',
            key: 'uploadTime',
            width: '20%',
            render: (time: string) => new Date(time).toLocaleString(),
        },
        {
            title: '操作',
            key: 'action',
            width: '20%',
            render: (_: any, record: WordFile) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<DownloadOutlined />}
                        onClick={() => message.info('下载功能开发中...')}
                    >
                        下载
                    </Button>
                    <Popconfirm
                        title="确定要删除这个文件吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2}>Word素材库</Title>
                <Space>
                    <Search
                        placeholder="搜索文件名或上传者"
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                        prefix={<SearchOutlined />}
                    />
                    <Upload
                        accept=".doc,.docx"
                        showUploadList={false}
                        beforeUpload={handleUpload}
                        maxCount={1}
                    >
                        <Button type="primary" icon={<UploadOutlined />}>
                            上传Word文件
                        </Button>
                    </Upload>
                </Space>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredFiles}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 个文件`,
                    }}
                />
            </Card>

            <Modal
                title="文件详情"
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setPreviewVisible(false)}>
                        关闭
                    </Button>,
                ]}
                width={600}
            >
                {selectedFile && (
                    <div>
                        <p><strong>文件名：</strong>{selectedFile.originalName}</p>
                        <p><strong>存储名：</strong>{selectedFile.filename}</p>
                        <p><strong>文件大小：</strong>{(selectedFile.fileSize / 1024).toFixed(2)} KB</p>
                        <p><strong>上传者：</strong>{selectedFile.uploader}</p>
                        <p><strong>上传时间：</strong>{new Date(selectedFile.uploadTime).toLocaleString()}</p>
                        <p><strong>文件ID：</strong>{selectedFile.id}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default WordLibrary;