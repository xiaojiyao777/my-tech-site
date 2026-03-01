import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
})

export interface ArticleListItem {
  id: string
  title: string
  summary: string
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
}

export interface ArticleDetail extends ArticleListItem {
  content: string
}

export interface ArticleListResponse {
  items: ArticleListItem[]
  total: number
  page: number
  size: number
  pages: number
}

export const getArticles = (page = 1, size = 10) =>
  api.get<ArticleListResponse>('/articles', { params: { page, size } })

export const getArticle = (id: string) =>
  api.get<ArticleDetail>(`/articles/${id}`)
