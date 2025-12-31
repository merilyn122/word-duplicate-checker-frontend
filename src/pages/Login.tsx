import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authAPI } from '../api/auth';
import { LoginCredentials } from '../types';

const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values: LoginCredentials) => {
        setLoading(true);
        dispatch(loginStart());

        try {
            const response = await authAPI.login(values);
            dispatch(loginSuccess(response));
            message.success('登录成功');
            navigate('/dashboard');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || '登录失败';
            dispatch(loginFailure(errorMessage));
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="管理员登录" style={{ width: 400, margin: '100px auto' }}>
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                size="large"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="用户名"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="密码"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LoginForm;