import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, List, Typography, Tag } from 'antd';
import {
    FileWordOutlined,
    BarChartOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import { wordAPI } from '../api/word';
import { reportAPI } from '../api/report';
import { WordFile, ReportData } from '../types';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
    const [fileCount, setFileCount] = useState(0);
    const [reportCount, setReportCount] = useState(0);
    const [recentFiles, setRecentFiles] = useState<WordFile[]>([]);
    const [recentReports, setRecentReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [files, reports] = await Promise.all([
                wordAPI.getFiles(),
                reportAPI.getReports(),
            ]);

            setFileCount(files.length);
            setReportCount(reports.length);
            setRecentFiles(files.slice(-5).reverse());
            setRecentReports(reports.slice(-5).reverse());
        } catch (error) {
            console.error('加载仪表板数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 状态标签颜色
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'processing';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return <div>加载中...</div>;
    }

    return (
        <div>
            <Title level={2}>系统概览</Title>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Word文件总数"
                            value={fileCount}
                            prefix={<FileWordOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="查重报告总数"
                            value={reportCount}
                            prefix={<BarChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="今日查重次数"
                            value={0}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="查重完成率"
                            value={100}
                            suffix="%"
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="最近上传的文件">
                        <List
                            dataSource={recentFiles}
                            renderItem={(file) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={file.originalName}
                                        description={
                                            <div>
                                                <div>上传者: {file.uploader}</div>
                                                <div>上传时间: {new Date(file.uploadTime).toLocaleString()}</div>
                                            </div>
                                        }
                                    />
                                    <div style={{ textAlign: 'right' }}>
                                        <div>{(file.fileSize / 1024).toFixed(2)} KB</div>
                                        <Text type="secondary">
                                            ID: {file.id}
                                        </Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="最近生成的报告">
                        <List
                            dataSource={recentReports}
                            renderItem={(report) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <div>
                                                {report.reportName || report.reportId}
                                                <Tag
                                                    color={getStatusColor(report.status)}
                                                    style={{ marginLeft: 8 }}
                                                >
                                                    {report.status === 'completed' ? '已完成' :
                                                        report.status === 'pending' ? '进行中' : '失败'}
                                                </Tag>
                                            </div>
                                        }
                                        description={
                                            <div>
                                                <div>生成时间: {new Date(report.generateDate).toLocaleString()}</div>
                                                <div>总体相似度: {report.overallSimilarity}%</div>
                                            </div>
                                        }
                                    />
                                    <div style={{ textAlign: 'right' }}>
                                        <div>比对文件: {report.compareFiles.length}个</div>
                                        <Text type="secondary">
                                            ID: {report.reportId}
                                        </Text>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;