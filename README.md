# AI-Image

AI-Image 是一个基于 Next.js 的 AI 图片生成工作台。用户可以从内置提示词模板出发，用一句自然语言描述修改需求，也可以直接自由输入画面描述，生成并继续迭代图片。

## 功能特点

- 模板生成：内置海报、信息图、空间、UI、人物、插画等示例模板。
- 自由生成：直接输入完整画面描述生成图片。
- 提示词改写：先用文本模型把用户意图改写成更适合图片生成的提示词。
- 聊天式历史：每次生成以会话形式保存在浏览器本地。
- 图片本地持久化：生成结果会优先使用 IndexedDB 保存，避免占满 localStorage。
- 生成限流：开发环境可用内存限流，生产环境建议配置 Upstash Redis。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- OpenAI SDK
- Vitest + Testing Library

## 本地运行

```bash
npm install
npm run dev
```

打开浏览器访问：

```text
http://localhost:3000
```

## 环境变量

先复制环境变量模板：

```bash
cp .env.example .env.local
```

至少需要配置可用的文本模型和图片模型密钥：

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=

TEXT_API_KEY=
TEXT_BASE_URL=
TEXT_MODEL=gpt-4.1-mini
TEXT_API_MODE=
TEXT_THINKING=

IMAGE_API_KEY=
IMAGE_BASE_URL=
IMAGE_MODEL=gpt-image-2

GENERATION_RATE_LIMIT_PER_HOUR=3
GENERATION_RATE_LIMIT_PER_DAY=10
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

说明：

- `OPENAI_API_KEY` 可以作为文本和图片模型的统一默认密钥。
- 如果文本模型和图片模型使用不同服务，可以分别配置 `TEXT_API_KEY` 和 `IMAGE_API_KEY`。
- `OPENAI_BASE_URL`、`TEXT_BASE_URL`、`IMAGE_BASE_URL` 适合接入兼容 OpenAI API 的服务。
- `UPSTASH_REDIS_REST_URL` 和 `UPSTASH_REDIS_REST_TOKEN` 是生产环境限流用的可选配置。

## 可用脚本

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
```

## 数据存储

当前公开版本不包含数据库接入：

- 聊天历史保存在浏览器 `localStorage`。
- 图片数据保存在浏览器 `IndexedDB`。
- 生成任务状态保存在服务端进程内存中。
- 限流在未配置 Redis 时使用内存存储。

因此，刷新页面后本地历史仍可保留，但换浏览器、换设备或清理浏览器数据后历史不会同步。

## 项目结构

```text
app/                 Next.js 页面与 API 路由
components/workspace 主要工作台组件
lib/                 提示词、历史、图片持久化、限流等逻辑
public/examples/     内置模板示例图
tests/               单元测试与组件测试
```

## 注意事项

- 不要提交 `.env.local` 或任何真实 API Key。
- 公开部署时建议配置 Redis 限流，避免生成接口被滥用。
- 当前仓库不包含数据库 migration、Supabase 配置或内部开发计划文档。
