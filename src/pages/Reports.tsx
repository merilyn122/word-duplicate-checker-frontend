import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Tag,
    Popconfirm,
    message,
    Typography,
    Input,
    DatePicker,
    Select,
    Row,
    Col,
} from 'antd';
import {
    DownloadOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { reportAPI } from '../api/report';
import { ReportData } from '../types';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports: React.FC = () => {
    const [reports, setReports] = useState<ReportData[]>([]);
    const [filteredReports, setFilteredReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const navigate = useNavigate();

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await reportAPI.getReports();
            setReports(data);
            setFilteredReports(data);
        } catch (error) {
            message.error('加载报告失败');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reportId: string) => {
        try {
            await reportAPI.deleteReport(reportId);
            message.success('删除成功');
            loadReports();
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleDownload = async (reportId: string, fileName: string) => {
        try {
            const blob = await reportAPI.downloadReport(reportId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.pdf` || `report_${reportId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            message.error('下载失败');
        }
    };

    const handleView = (reportId: string) => {
        navigate(`/check-duplicate?report=${reportId}`);
    };

    const handleSearch = () => {
        let filtered = [...reports];

        // 按状态过滤
        if (statusFilter !== 'all') {
            filtered = filtered.filter(report => report.status === statusFilter);
        }

        // 按搜索文本过滤
        if (searchText) {
            filtered = filtered.filter(report =>
                (report.reportName || '').toLowerCase().includes(searchText.toLowerCase()) ||
                report.targetFile.originalName.toLowerCase().includes(searchText.toLowerCase()) ||
                report.reportId.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredReports(filtered);
    };

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

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return '已完成';
            case 'pending':
                return '进行中';
            case 'failed':
                return '失败';
            default:
                return status;
        }
    };

    const columns = [
        {
            title: '报告名称',
            dataIndex: 'reportName',
            key: 'reportName',
            width: '25%',
            render: (text: string, record: ReportData) => (
                <div>
                    <div>{text || record.reportId}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                        目标文件: {record.targetFile.originalName}
                    </div>
                </div>
            ),
        },
        {
            title: '报告ID',
            dataIndex: 'reportId',
            key: 'reportId',
            width: '15%',
        },
        {
            title: '总体相似度',
            dataIndex: 'overallSimilarity',
            key: 'overallSimilarity',
            width: '15%',
            render: (similarity: number) => (
                <Tag color={similarity > 70 ? 'red' : similarity > 30 ? 'orange' : 'green'}>
                    {similarity}%
                </Tag>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: '生成时间',
            dataIndex: 'generateDate',
            key: 'generateDate',
            width: '15%',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: '操作',
            key: 'action',
            width: '20%',
            render: (_: any, record: ReportData) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record.id)}
                    >
                        查看
                    </Button>
                    <Button
                        type="text"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(record.id, record.reportName || record.reportId)}
                    >
                        下载
                    </Button>
                    <Popconfirm
                        title="确定要删除这个报告吗？"
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
                <Title level={2}>查重报告</Title>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={loadReports}
                    loading={loading}
                >
                    刷新
                </Button>
            </div>

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <Search
                            placeholder="搜索报告名称、文件名或ID"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSearch={handleSearch}
                            allowClear
                            style={{ width: '100%' }}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col span={8}>
                        <Select
                            placeholder="按状态筛选"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Option value="all">全部状态</Option>
                            <Option value="completed">已完成</Option>
                            <Option value="pending">进行中</Option>
                            <Option value="failed">失败</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Button
                            type="primary"
                            onClick={handleSearch}
                            style={{ width: '100%' }}
                        >
                            筛选
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredReports}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 个报告`,
                    }}
                />
            </Card>
        </div>
    );
};

export default Reports;