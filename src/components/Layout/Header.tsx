import React from 'react';
import { Layout, Button, Dropdown, Avatar, MenuProps } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const { Header: AntHeader } = Layout;

interface HeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人中心',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            onClick: handleLogout,
        },
    ];

    // 尝试从 localStorage 获取用户信息
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return (
        <AntHeader style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px #f0f1f2'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ fontSize: '16px', width: 64, height: 64 }}
                />
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                    文档查重系统
                </div>
            </div>

            <div style={{ marginRight: 24, display: 'flex', alignItems: 'center' }}>
                {user && (
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <Avatar
                                style={{ backgroundColor: '#1890ff' }}
                                icon={<UserOutlined />}
                            />
                            <span style={{ marginLeft: 8, marginRight: 8 }}>
                                {user.username || user.name || '管理员'}
                            </span>
                        </div>
                    </Dropdown>
                )}
            </div>
        </AntHeader>
    );
};

export default Header;