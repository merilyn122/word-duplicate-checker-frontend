# Word查重系统 

## 技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^19.2.3 | 前端框架 |
| TypeScript | ^4.9.5 | 类型安全开发 |
| Ant Design | ^6.1.3 | UI组件库 |
| Redux Toolkit | ^2.11.2 | 状态管理 |
| React Router | ^7.11.0 | 路由管理 |
| Axios | ^1.13.2 | HTTP请求 |


##  项目结构
### 项目结构
- **word-duplicate-checker-frontend/**
    - **public/** - 静态资源
    - **src/**
        - **api/** - API接口层
            - auth.ts - 认证API
            - word.ts - 文件管理API
            - report.ts - 报告API
            - index.ts - API统一导出
        - **components/** - 组件
            - **Auth/** - 认证相关组件
            - **Layout/** - 布局组件
            - **Report/** - 报告相关组件
            - **Word/** - 文件相关组件
        - **pages/** - 页面组件
            - Login.tsx - 登录页面
            - Dashboard.tsx - 仪表板
            - CheckDuplicate.tsx - 查重页面
            - WordLibrary.tsx - 文件库页面
            - Reports.tsx - 报告页面
        - **store/** - Redux状态管理
            - **slices/** - Redux切片
            - hooks.ts - Redux钩子
            - index.ts - Store配置
        - **styles/** - 样式文件
        - **types/** - TypeScript类型定义
        - **utils/** - 工具函数
        - App.tsx - 根组件
        - router.tsx - 路由配置
        - index.tsx - 应用入口
    - package.json - 项目依赖配置
    - tsconfig.json - TypeScript配置
    - README.md - 项目说明

## 快速开始

### 环境要求
- **Node.js**: 16.x 或更高版本
- **npm**: 8.x 或更高版本
- **后端API**: 需要配套的后端服务

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/merilyn122/word-duplicate-checker-frontend
   cd word-duplicate-checker-frontend
   ```
   或者直接在Github界面code下载zip再在IDE中运行


2. **安装依赖**
   ```bash
   npm install
   # 或使用 yarn
   yarn install
   ```

3. **环境变量配置**

   创建 `.env.development` 文件（开发环境）：
   ```env
   REACT_APP_API_BASE_URL=http://localhost:3000/api
   REACT_APP_TITLE=Word查重系统（开发环境）
   ```

   创建 `.env.production` 文件（生产环境）：
   ```env
   REACT_APP_API_BASE_URL=https://your-api-domain.com/api
   REACT_APP_TITLE=Word查重系统
   ```

   > 注意：将 `http://localhost:3000/api` 替换为你的后端API地址

4. **启动开发服务器**
   ```bash
   npm start
   # 或
   yarn start
   ```
   应用将在 http://localhost:3000 启动

5. **构建生产版本**
   ```bash
   npm run build
   # 或
   yarn build
   ```
   构建产物将在 `build` 文件夹中

##  后端API对接

前端项目需要后端提供以下API接口：

### 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 文件管理
- `GET /api/words/files` - 获取文件列表
- `POST /api/words/upload` - 上传Word文件
- `DELETE /api/words/files/:id` - 删除文件
- `GET /api/words/files/:id` - 获取文件详情

### 查重比对
- `POST /api/reports/compare` - 执行文档比对
- `GET /api/reports` - 获取历史报告列表
- `GET /api/reports/:id` - 获取报告详情

### 接口响应格式示例
```typescript
// 定义接口响应类型
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
}

// 成功响应示例
const successResponse: ApiResponse<{ id: number; name: string }> = {
  "success": true,
  "data": { /* 数据 */ },
  "message": "操作成功"
};

// 错误响应示例
const errorResponse: ApiResponse = {
  "success": false,
  "message": /* 错误信息 */
};
```


## 页面说明

### 1. 登录页面 (`/login`)
- 管理员账号登录
- 表单验证

### 2. 仪表板 (`/dashboard`)
- 系统概览
- 快捷操作入口

### 3. 文件库 (`/words`)
- 上传Word文件
- 管理已有文件
- 查看文件详情

### 4. 文档查重 (`/check`)
- 选择目标文件和比对文件
- 设置查重敏感度
- 执行查重并查看结果

### 5. 查重报告 (`/reports`)
- 查看历史查重报告
- 下载/分享报告
- 查看详细匹配内容

## 开发指南

### 添加新页面
1. 在 `src/pages` 创建页面组件
2. 在 `src/router.tsx` 中添加路由
3. 在 `src/types` 中添加相关类型定义

### 添加API接口
1. 在 `src/api` 下创建对应模块的API文件
2. 在 `src/api/index.ts` 中导出
3. 使用 `axios` 发送请求

### 状态管理
- 使用 Redux Toolkit 管理全局状态
- 每个模块在 `src/store/slices` 下创建切片
- 使用 `useAppSelector` 和 `useAppDispatch` 访问状态

恭喜成功！为了确保后端开发者清楚这是个**临时方案**，并在完成后能**顺利还原**，请在项目的 `README.md` 文件中添加以下章节。

你可以将以下内容直接复制到 `README.md` 的末尾或“开发说明”部分。

---

## 前端登录功能临时模拟方案说明

### 背景
在项目初期或后端API尚未就绪时，为了测试前端登录流程及相关权限功能，前端采用了一种**临时模拟方案**。该方案将登录验证逻辑写死在前端代码中，**仅用于开发和演示**。

### 受影响文件
- **主要文件**：`src/api/auth.ts` - 登录、登出、获取用户信息接口已被模拟。

### 临时方案详情
当前，`auth.ts` 中的 `login` 函数包含硬编码的验证逻辑，核心代码如下：
```typescript
// 模拟验证逻辑（位于 login 函数内）
const HARD_CODED_USERNAME = 'admin';
const HARD_CODED_PASSWORD = 'password'; // 与项目根目录 `db.json` 中的密码一致

if (credentials.username === HARD_CODED_USERNAME && 
    credentials.password === HARD_CODED_PASSWORD) {
    // 返回模拟的成功数据
    return {
        token: 'eyJ...mock_token',
        user: { id: '1', username: 'admin', email: '2212023096@qq.com', role: 'administrator' }
    };
}
```
**测试账户**：
- **用户名**：`admin`
- **密码**：`password` (全小写)

**测试方式**：
npm运行本项目后，在浏览器的 http://localhost:3000/login 中输入测试账户用户名及密码，即可查看模拟界面

### 后端就绪后的还原步骤
在后端开发者检查完毕模拟界面后，请开发并准备真实的后端API服务，此前请**必须**执行以下还原操作：

#### 第一步：恢复 `src/api/auth.ts` 文件
将此文件**完全恢复**为原始的、真正发送网络请求的版本(源代码已备份于backup中，即将src/api/auth.ts改为backup/auth.ts)


#### 第二步：检查并恢复 `src/api/index.ts` 配置
确保 `API_BASE_URL` 指向正确的后端服务地址（根据 `.env.development` 等环境变量配置）。通常应为：
```typescript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'; // 请根据实际后端端口调整
```

#### 第三步：移除模拟数据文件
删除项目根目录下为模拟服务创建的 `db.json`、`server.js` 等临时文件。

#### 第四步：更新依赖（如果安装了模拟包）
如果之前运行过 `npm install json-server --save-dev`，可以考虑从 `package.json` 的 `devDependencies` 中移除 `json-server`，并运行 `npm install` 以清理依赖。

### 还原验证清单
完成上述还原后，请验证以下事项：
- [ ] `auth.ts` 中的 `login` 函数 **不再包含** `HARD_CODED_USERNAME` 和 `HARD_CODED_PASSWORD` 等硬编码逻辑。
- [ ] `API_BASE_URL` 已配置为后端服务器的正确地址和端口（如 `http://localhost:8080`）。
- [ ] 后端服务已启动并在指定端口监听。
- [ ] 在前端使用真实的后端管理员账户进行登录测试，功能正常。

### 遇到问题？
如果在切换回真实后端时遇到登录问题，请按以下步骤排查：
1. **检查网络请求**：打开浏览器开发者工具的“网络(Network)”选项卡，查看登录请求的URL、状态码和响应体。
2. **确认CORS**：确保后端服务已正确配置CORS，允许前端源（如 `http://localhost:3000`）进行跨域请求。
3. **核对接口格式**：验证后端 `/auth/login` 接口返回的JSON数据结构是否与前端 `auth.ts` 中解析的格式（`token`, `user` 等字段）一致。

---
**请后端开发者在完成API开发后，务必通知前端开发者协同完成上述还原步骤，以确保系统切换至真实认证流程。**

## 常见问题

### 1. 启动时出现端口冲突
```bash
# 指定其他端口启动
PORT=3001 npm start
```

### 2. 安装依赖失败
- 清除 npm 缓存：`npm cache clean --force`
- 删除 node_modules 和 package-lock.json 后重新安装

### 3. 编译 TypeScript 错误
- 确保所有 `.ts` 文件都有正确的导出
- 检查类型定义是否完整

### 4. API 请求跨域问题
- 确保后端已配置 CORS
- 或使用代理配置（在 `package.json` 中添加 proxy）

## 构建与部署

### 构建优化
```bash
# 分析构建体积
npm run build -- --analyze
```

### Docker部署
```dockerfile
# Dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

