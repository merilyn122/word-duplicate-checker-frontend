import React from 'react';
import { Card, Table, Progress, Tag, Alert, Typography } from 'antd';
import { SimilarityResult, ReportData } from '../../types';

const { Title, Text } = Typography;

interface ReportViewerProps {
    report: ReportData;
    results: SimilarityResult[];
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report, results }) => {
    // 定义表格列
    const columns = [
        {
            title: '比对文件',
            dataIndex: 'sourceFileName',
            key: 'compareFile',
            width: '30%',
        },
        {
            title: '相似度',
            dataIndex: 'similarity',
            key: 'similarity',
            width: '30%',
            render: (similarity: number) => (
                <div>
                    <Progress
                        percent={Math.round(similarity)}
                        status={similarity > 0.7 ? 'exception' : similarity > 0.3 ? 'normal' : 'success'}
                        size="small"
                        style={{ width: 200 }}
                    />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                        {Math.round(similarity * 100)}%
                    </Text>
                </div>
            ),
        },
        {
            title: '匹配段落数',
            dataIndex: ['matchedSegments', 'length'],
            key: 'sections',
            width: '20%',
        },
        {
            title: '状态',
            key: 'status',
            width: '20%',
            render: (_: any, record: SimilarityResult) => (
                <Tag color={record.similarity > 0.7 ? 'red' : record.similarity > 0.3 ? 'orange' : 'green'}>
                    {record.similarity > 0.7 ? '高风险' : record.similarity > 0.3 ? '中等风险' : '低风险'}
                </Tag>
            ),
        },
    ];

    // 如果没有结果数据，显示空状态
    if (!results || results.length === 0) {
        return (
            <Card title="查重报告">
                <Alert
                    message="暂无查重结果"
                    description="请先进行查重比对操作"
                    type="info"
                    showIcon
                />
            </Card>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Card
                title={
                    <div>
                        <Title level={4} style={{ margin: 0 }}>
                            文档查重报告
                        </Title>
                        <Text type="secondary">
                            报告ID: {report.reportId} | 生成时间: {report.generateDate}
                        </Text>
                    </div>
                }
                style={{ marginBottom: 24 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                        <Text strong>目标文件: </Text>
                        <Text>{report.targetFile.originalName}</Text>
                    </div>
                    <div>
                        <Text strong>整体相似度: </Text>
                        <Tag color={report.overallSimilarity > 0.7 ? 'red' : report.overallSimilarity > 0.3 ? 'orange' : 'green'}>
                            {Math.round(report.overallSimilarity * 100)}%
                        </Tag>
                    </div>
                </div>

                <Alert
                    message={
                        report.overallSimilarity > 0.7
                            ? '高风险警告：文档相似度过高，可能存在抄袭风险'
                            : report.overallSimilarity > 0.3
                                ? '中等风险：文档存在部分相似内容'
                                : '低风险：文档原创性较高'
                    }
                    type={report.overallSimilarity > 0.7 ? 'error' : report.overallSimilarity > 0.3 ? 'warning' : 'success'}
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            </Card>

            <Card title="详细比对结果">
                <Table
                    columns={columns}
                    dataSource={results}
                    rowKey={(record) => `${record.sourceFileId}`}
                    pagination={false}
                    expandable={{
                        expandedRowRender: (record: SimilarityResult) => (
                            <div style={{ margin: 0 }}>
                                <Text strong>匹配段落详情：</Text>
                                {record.matchedSegments.map((segment, index) => (
                                    <Card
                                        key={index}
                                        size="small"
                                        style={{ marginTop: 8 }}
                                        title={`段落 ${index + 1}`}
                                    >
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            <div style={{ flex: 1 }}>
                                                <Text type="secondary">目标文件内容：</Text>
                                                <div style={{
                                                    background: '#f6ffed',
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    marginTop: 4
                                                }}>
                                                    {segment.text}
                                                </div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Text type="secondary">比对文件内容：</Text>
                                                <div style={{
                                                    background: '#fff7e6',
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    marginTop: 4
                                                }}>
                                                    起始位置: {segment.position}, 长度: {segment.length}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default ReportViewer;
