import { useEffect, useState } from 'react'
import { Typography, Tag, Space, Spin, Button, message } from 'antd'
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { getArticle, ArticleDetail as IArticleDetail } from '../services/api'

const { Title, Paragraph, Text } = Typography

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<IArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getArticle(id)
      .then(res => setArticle(res.data))
      .catch(() => message.error('文章不存在或加载失败'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>
  if (!article) return <div style={{ textAlign: 'center', paddingTop: 80 }}>文章不存在</div>

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginBottom: 24 }}>
        返回首页
      </Button>
      <Title level={1} style={{ marginBottom: 12 }}>{article.title}</Title>
      <Space wrap style={{ marginBottom: 24 }}>
        <Space>
          <CalendarOutlined style={{ color: '#999' }} />
          <Text type="secondary">{new Date(article.created_at).toLocaleDateString('zh-CN')}</Text>
        </Space>
        {article.tags.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
      </Space>
      <div style={{ lineHeight: 1.8, fontSize: 16, whiteSpace: 'pre-wrap', color: '#333' }}>
        {article.content}
      </div>
    </div>
  )
}
