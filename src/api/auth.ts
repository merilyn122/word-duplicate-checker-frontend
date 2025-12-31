import api from './index';
import { LoginCredentials, AuthResponse } from '../types';

export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', credentials);
        return {
            token: response.data.token || response.data.access_token,
            user: {
                id: response.data.user?.id || response.data.userId || '',
                username: response.data.user?.username || response.data.username || '',
                email: response.data.user?.email || response.data.email || '',
                role: response.data.user?.role || response.data.role || 'admin',
            }
        };
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },

    // 获取当前用户信息
    getCurrentUser: async (): Promise<AuthResponse['user']> => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};