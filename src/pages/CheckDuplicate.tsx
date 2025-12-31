import React, { useState, useEffect } from 'react';
import { Tabs, Alert, Space, Spin } from 'antd';
import CompareForm from '../components/Word/CompareForm';
import ReportViewer from '../components/Report/ReportViewer';
import { WordFile, SimilarityResult, ReportData } from '../types';
import { wordAPI } from '../api/word';

const { TabPane } = Tabs;

const CheckDuplicate: React.FC = () => {
    const [files, setFiles] = useState<WordFile[]>([]);
    const [compareResults, setCompareResults] = useState<SimilarityResult[]>([]);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const data = await wordAPI.getFiles();
            setFiles(data);
        } catch (error) {
            console.error('加载文件失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompareComplete = (data: {
        compareResults: SimilarityResult[];
        report: ReportData;
    }) => {
        setCompareResults(data.compareResults);
        setReportData(data.report);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin size="large" tip="加载中..." />
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <Alert
                message="提示"
                description="请先上传 Word 文件到素材库，然后进行查重比对"
                type="info"
                showIcon
            />
        );
    }

    return (
        <div>
            <Alert
                message="查重说明"
                description="选择目标文件与比对文件，系统将进行内容相似度分析并生成查重报告"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <Tabs defaultActiveKey="1" activeKey={reportData ? "2" : "1"} onChange={() => {}}>
                <TabPane tab="查重配置" key="1">
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <CompareForm
                            files={files}
                            onCompareComplete={handleCompareComplete}
                        />
                    </Space>
                </TabPane>

                <TabPane
                    tab="查重结果"
                    key="2"
                    disabled={!reportData}
                    forceRender
                >
                    {reportData && (
                        <ReportViewer
                            report={reportData}
                            results={compareResults}
                        />
                    )}
                </TabPane>
            </Tabs>
        </div>
    );
};

export default CheckDuplicate;