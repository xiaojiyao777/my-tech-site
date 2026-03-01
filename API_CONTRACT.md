# API Contract - My Tech Site

Base URL: `http://localhost:8000/api/v1`

---

## 健康检查

### GET /health
```json
{ "status": "ok", "env": "development" }
```

---

## 文章接口

### GET /api/v1/articles
获取已发布文章列表（分页）

**Query Params:**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码 |
| size | int | 10 | 每页数量（最大100）|

**Response 200:**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "文章标题",
      "summary": "摘要",
      "tags": ["LLM", "Python"],
      "published": true,
      "created_at": "2026-03-01T10:00:00Z",
      "updated_at": "2026-03-01T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "size": 10,
  "pages": 10
}
```

---

### GET /api/v1/articles/{id}
获取文章详情（含完整内容）

**Response 200:**
```json
{
  "id": "uuid",
  "title": "文章标题",
  "summary": "摘要",
  "content": "Markdown 格式正文...",
  "tags": ["LLM"],
  "published": true,
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T10:00:00Z"
}
```

**Response 404:**
```json
{ "detail": "Article not found" }
```

---

## 前端集成说明

- 列表页：调用 `GET /api/v1/articles` 渲染文章卡片列表，支持翻页
- 详情页：调用 `GET /api/v1/articles/{id}` 渲染 Markdown 内容
- CORS 已允许 `http://localhost:3000` 和 `http://localhost:5173`
