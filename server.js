const jsonServer = require('./node_modules/json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// 使用默认中间件和body解析器
server.use(middlewares);
server.use(jsonServer.bodyParser);

// 自定义登录路由 - 核心！
server.post('/api/auth/login', (req, res) => {
    console.log('收到登录请求:', req.body);

    const { username, password } = req.body;

    // 从数据库（db.json）中查找用户
    const db = router.db;
    const user = db.get('users').find({ username, password }).value();

    if (user) {
        // 登录成功 - 返回与auth.ts期望的格式
        res.json({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-' + user.id,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
        console.log('登录成功，用户:', user.username);
    } else {
        // 登录失败
        res.status(401).json({
            message: '用户名或密码错误'
        });
        console.log('登录失败:', username);
    }
});

// 其他API路由
server.use('/api', router);

// 启动服务器
server.listen(3001, () => {
    console.log('模拟API服务器运行在 http://localhost:3001');
    console.log('可用接口:');
    console.log('  POST   /api/auth/login    - 用户登录');
    console.log('  GET    /api/users         - 获取用户列表');
});