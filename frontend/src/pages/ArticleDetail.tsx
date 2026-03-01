import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Tag, Spin, Button, Space, Divider } from 'antd'
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons'
import { getArticle, ArticleDetail as IArticleDetail } from '../api/articles'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography
const TAG_COLORS = ['blue', 'geekblue', 'purple', 'cyan', 'green', 'volcano']

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<IArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getArticle(id)
      .then(res => setArticle(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
  if (!article) return null

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        type="link"
        style={{ paddingLeft: 0, marginBottom: 24 }}
        onClick={() => navigate('/')}
      >
        返回首页
      </Button>

      <Space style={{ marginBottom: 12 }}>
        {article.tags.map((tag, i) => (
          <Tag key={tag} color={TAG_COLORS[i % TAG_COLORS.length]}>{tag}</Tag>
        ))}
      </Space>

      <Title>{article.title}</Title>

      <Text type="secondary">
        <CalendarOutlined style={{ marginRight: 6 }} />
        {dayjs(article.created_at).format('YYYY年MM月DD日')}
      </Text>

      <Divider />

      <Paragraph style={{ fontSize: 16, lineHeight: 2, whiteSpace: 'pre-wrap' }}>
        {article.content}
      </Paragraph>
    </div>
  )
}
