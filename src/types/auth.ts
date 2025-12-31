export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}