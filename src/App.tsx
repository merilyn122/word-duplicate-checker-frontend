import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { store } from './store';
import AppRouter from './router';
import './App.css';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ConfigProvider
                locale={zhCN}
                theme={{
                    token: {
                        colorPrimary: '#1890ff',
                    },
                }}
            >
                <AppRouter />
            </ConfigProvider>
        </Provider>
    );
};

export default App;