// login-middleware.js
module.exports = (req, res, next) => {
    // 1. 拦截特定的登录请求
    if (req.method === 'POST' && req.path === '/api/auth/login') {
        console.log('[Mock Server] 拦截到登录请求:', req.body);

        // 2. 这里进行账号密码验证 (与 db.json 中的第一用户比对)
        const { username, password } = req.body;
        if (username === 'admin' && password === 'password') {
            // 3. 模拟登录成功，返回前端 auth.ts 期望的格式
            res.status(200).json({
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_jwt_token_for_admin',
                user: {
                    id: 1,
                    username: 'admin',
                    email: '2212023096@qq.com',
                    role: 'admin'
                }
            });
            return; // 重要：直接返回响应，不交给默认的 JSON Server 处理
        } else {
            // 4. 模拟登录失败
            res.status(401).json({
                message: '用户名或密码错误'
            });
            return;
        }
    }
    // 5. 对于其他所有请求，交给 JSON Server 按默认规则处理
    next();
}