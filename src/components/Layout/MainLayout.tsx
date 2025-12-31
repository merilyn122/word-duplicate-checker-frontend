import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    DashboardOutlined,
    FileWordOutlined,
    BarChartOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Header from './Header';

const { Sider, Content } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: '仪表板',
        },
        {
            key: '/word-library',
            icon: <FileWordOutlined />,
            label: 'Word素材库',
        },
        {
            key: '/check-duplicate',
            icon: <BarChartOutlined />,
            label: '查重比对',
        },
        {
            key: '/reports',
            icon: <BarChartOutlined />,
            label: '报告列表',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            onClick: () => {
                dispatch(logout());
                navigate('/login');
            }
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className="demo-logo-vertical" style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h2 style={{ color: 'white', margin: 0 }}>
                        {collapsed ? 'WD' : '查重系统'}
                    </h2>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/dashboard']}
                    items={menuItems}
                    onClick={({ key }) => {
                        if (key !== 'logout') {
                            navigate(key);
                        }
                    }}
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <Content style={{ margin: '16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;