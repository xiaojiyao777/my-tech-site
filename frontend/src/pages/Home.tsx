import { useEffect, useState } from 'react'
import { Card, List, Tag, Typography, Pagination, Space, Spin, message } from 'antd'
import { CalendarOutlined, TagsOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getArticles, ArticleListItem } from '../services/api'

const { Title, Paragraph, Text } = Typography

export default function Home() {
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchArticles = async (p: number) => {
    setLoading(true)
    try {
      const res = await getArticles(p, 10)
      setArticles(res.data.items)
      setTotal(res.data.total)
    } catch {
      message.error('获取文章失败，请确认后端服务已启动')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchArticles(page) }, [page])

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={1} style={{ fontSize: 36, marginBottom: 12 }}>
          👨‍💻 Jiyao 的技术空间
        </Title>
        <Paragraph style={{ fontSize: 16, color: '#666' }}>
          运筹优化 · LLM 研究 · Agent 工程 · 全栈开发
        </Paragraph>
      </div>

      {/* Article List */}
      <Title level={3} style={{ marginBottom: 24 }}>最新文章</Title>
      <Spin spinning={loading}>
        <List
          dataSource={articles}
          renderItem={(item) => (
            <Card
              hoverable
              style={{ marginBottom: 16, cursor: 'pointer' }}
              onClick={() => navigate(`/article/${item.id}`)}
            >
              <Title level={4} style={{ marginBottom: 8 }}>{item.title}</Title>
              <Paragraph style={{ color: '#555', marginBottom: 12 }}>
                {item.summary}
              </Paragraph>
              <Space wrap>
                <Space>
                  <CalendarOutlined style={{ color: '#999' }} />
                  <Text type="secondary">
                    {new Date(item.created_at).toLocaleDateString('zh-CN')}
                  </Text>
                </Space>
                {item.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </Space>
            </Card>
          )}
        />
      </Spin>

      {total > 10 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Pagination
            current={page}
            total={total}
            pageSize={10}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  )
}
