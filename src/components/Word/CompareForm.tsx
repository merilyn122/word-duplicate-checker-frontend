import React, { useState, useEffect } from 'react';
import {
    Form,
    Select,
    Slider,
    Button,
    Card,
    message,
    Row,
    Col,
    Input,
} from 'antd';
import { WordFile, CompareRequest } from '../../types/word';
import { wordAPI } from '../../api/word';
import { reportAPI } from '../../api/report';

const { Option } = Select;

interface CompareFormProps {
    files: WordFile[];
    onCompareComplete?: (results: any) => void;
}

const CompareForm: React.FC<CompareFormProps> = ({ files, onCompareComplete }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [reportName, setReportName] = useState('');

    useEffect(() => {
        // 生成默认报告名
        const date = new Date();
        const defaultName = `查重报告_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours()}${date.getMinutes()}`;
        setReportName(defaultName);
    }, []);

    const handleCompare = async (values: any) => {
        if (!values.targetFileId) {
            message.error('请选择目标文件');
            return;
        }

        if (!values.sourceFileIds || values.sourceFileIds.length === 0) {
            message.error('请至少选择一个比对文件');
            return;
        }

        setLoading(true);
        try {
            // 1. 先进行文件比对
            const compareRequest: CompareRequest = {
                targetFileId: values.targetFileId,
                sourceFileIds: values.sourceFileIds,
                sensitivity: values.sensitivity,
            };

            const compareResults = await wordAPI.compareFiles(compareRequest);

            // 2. 生成报告
            const reportRequest = {
                ...compareRequest,
                reportName: reportName || values.reportName,
            };

            const report = await reportAPI.generateReport(reportRequest);

            message.success('比对完成，报告已生成');
            onCompareComplete?.({
                compareResults,
                report,
            });
        } catch (error) {
            message.error('比对失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="查重比对配置">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleCompare}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="目标文件"
                            name="targetFileId"
                            rules={[{ required: true, message: '请选择目标文件' }]}
                        >
                            <Select placeholder="选择要检测的文件">
                                {files.map(file => (
                                    <Option key={file.id} value={file.id}>
                                        {file.originalName} ({new Date(file.uploadTime).toLocaleDateString()})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="比对文件"
                            name="sourceFileIds"
                            rules={[{ required: true, message: '请选择比对文件' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="选择要比对的文件"
                                maxTagCount={3}
                            >
                                {files.map(file => (
                                    <Option key={file.id} value={file.id}>
                                        {file.originalName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="报告名称"
                    name="reportName"
                    initialValue={reportName}
                >
                    <Input
                        placeholder="输入报告名称"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="查重灵敏度"
                    name="sensitivity"
                    initialValue={70}
                >
                    <Slider
                        min={0}
                        max={100}
                        marks={{
                            0: '宽松',
                            50: '中等',
                            100: '严格'
                        }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        size="large"
                    >
                        开始查重比对
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CompareForm;