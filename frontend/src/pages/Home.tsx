import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Tag, Card, Row, Col, Pagination, Spin, Empty, Space, Alert } from 'antd'
import { CalendarOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { getArticles, ArticleListItem } from '../api/articles'
import dayjs from 'dayjs'

const { Title, Paragraph, Text } = Typography
const TAG_COLORS = ['blue', 'geekblue', 'purple', 'cyan', 'green', 'volcano']

export default function Home() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // 取消上一次未完成的请求（防止竞态条件）
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    getArticles(page, 9)
      .then(res => {
        if (controller.signal.aborted) return
        setArticles(res.data.items)
        setTotal(res.data.total)
      })
      .catch(err => {
        if (err?.name === 'CanceledError' || controller.signal.aborted) return
        setError('文章加载失败，请稍后重试')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [page])

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '64px 0 48px' }}>
        <Title style={{ fontSize: 48, marginBottom: 16 }}>
          👋 Hi, I'm <span style={{ color: '#1677ff' }}>Jiyao</span>
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto' }}>
          专注于 LLM 内核研究、运筹优化与 Agent 自动化的工程师。
          这里记录我的技术探索与实践。
        </Paragraph>
        <Space style={{ marginTop: 24 }}>
          {['LLM', 'Transformer', 'Agent', 'Operations Research', 'Python', 'FastAPI'].map((tag, i) => (
            <Tag key={tag} color={TAG_COLORS[i % TAG_COLORS.length]} style={{ fontSize: 13, padding: '2px 10px' }}>
              {tag}
            </Tag>
          ))}
        </Space>
      </div>

      {/* Articles */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>最新文章</Title>
      </div>

      {error && (
        <Alert type="error" message={error} showIcon style={{ marginBottom: 24 }} />
      )}

      <Spin spinning={loading}>
        {!loading && !error && articles.length === 0 ? (
          <Empty description="暂无文章" />
        ) : (
          <Row gutter={[24, 24]}>
            {articles.map(article => (
              <Col xs={24} sm={12} lg={8} key={article.id}>
                <Card
                  hoverable
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
                  onClick={() => navigate(`/articles/${article.id}`)}
                >
                  <Space style={{ marginBottom: 8 }}>
                    {article.tags.slice(0, 2).map((tag, i) => (
                      <Tag key={tag} color={TAG_COLORS[i % TAG_COLORS.length]}>{tag}</Tag>
                    ))}
                  </Space>
                  <Title level={5} style={{ marginTop: 0 }}>{article.title}</Title>
                  <Paragraph ellipsis={{ rows: 3 }} style={{ color: '#666', flex: 1 }}>
                    {article.summary}
                  </Paragraph>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      {dayjs(article.created_at).format('YYYY-MM-DD')}
                    </Text>
                    <Text style={{ color: '#1677ff', fontSize: 12 }}>
                      阅读全文 <ArrowRightOutlined />
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>

      {total > 9 && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Pagination current={page} total={total} pageSize={9} onChange={setPage} showSizeChanger={false} />
        </div>
      )}
    </div>
  )
}
