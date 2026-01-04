import api from './index';
import { LoginCredentials, AuthResponse } from '../types';

export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {


        // 1. 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 300));

        // 2. 在这里设置你的管理员账号和密码
        const HARD_CODED_USERNAME = 'admin';
        const HARD_CODED_PASSWORD = 'password'; // 与你的 db.json 完全一致

        console.log('[模拟登录] 尝试用户:', credentials.username);

        // 3. 验证逻辑（完全在前端完成）
        if (credentials.username === HARD_CODED_USERNAME &&
            credentials.password === HARD_CODED_PASSWORD) {
            // 4. 模拟成功响应
            const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.mock_admin_token_123';
            const userData = {
                id: '1',
                username: HARD_CODED_USERNAME,
                email: '2212023096@qq.com', // 你的邮箱
                role: 'administrator'        // 与 db.json 中的 role 一致
            };

            console.log('[模拟登录] 成功:', userData.username);

            return {
                token: mockToken,
                user: userData
            };
        } else {
            // 5. 模拟失败响应
            console.log('[模拟登录] 失败:', credentials.username);
            const error: any = new Error('登录失败');
            error.response = {
                data: {
                    message: '用户名或密码错误'
                }
            };
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        // 模拟登出，直接返回成功
        console.log('[模拟登出]');
        await new Promise(resolve => setTimeout(resolve, 100));
        // 这里不需要实际调用 api.post
    },

    // 获取当前用户信息
    getCurrentUser: async (): Promise<AuthResponse['user']> => {
        // 模拟获取用户信息，从 localStorage 读取
        console.log('[模拟] 获取当前用户');
        await new Promise(resolve => setTimeout(resolve, 100));

        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }

        // 如果没有登录信息，模拟一个错误
        const error: any = new Error('未登录');
        error.response = { status: 401 };
        throw error;
    },
};