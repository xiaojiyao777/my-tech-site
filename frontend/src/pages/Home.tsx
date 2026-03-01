import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Tag, Card, Row, Col, Pagination, Spin, Empty, Space, Alert, Avatar, Divider, Timeline } from 'antd'
import { CalendarOutlined, ArrowRightOutlined, GithubOutlined, BookOutlined, RocketOutlined, CodeOutlined, ExperimentOutlined } from '@ant-design/icons'
import { getArticles } from '../api/articles'
import type { ArticleListItem } from '../api/articles'
import dayjs from 'dayjs'

const { Title, Paragraph, Text, Link } = Typography
const TAG_COLORS = ['blue', 'geekblue', 'purple', 'cyan', 'green', 'volcano']

// Karpathy 风格技术资源推荐
const LEARNING_RESOURCES = [
  {
    title: 'Neural Networks: Zero to Hero',
    author: 'Andrej Karpathy',
    url: 'https://youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ',
    desc: '从头实现 GPT、微梯度、makemore，必看系列',
    tag: 'Video',
    color: 'red',
  },
  {
    title: 'Attention Is All You Need',
    author: 'Vaswani et al.',
    url: 'https://arxiv.org/abs/1706.03762',
    desc: 'Transformer 原始论文，读懂一切的起点',
    tag: 'Paper',
    color: 'blue',
  },
  {
    title: 'The Annotated Transformer',
    author: 'Harvard NLP',
    url: 'https://nlp.seas.harvard.edu/annotated-transformer/',
    desc: '逐行注释的 Transformer 实现，配合原论文食用',
    tag: 'Code',
    color: 'green',
  },
  {
    title: 'Let\'s build GPT from scratch',
    author: 'Andrej Karpathy',
    url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
    desc: '1小时从零实现 GPT，Karpathy 最经典视频',
    tag: 'Video',
    color: 'red',
  },
  {
    title: 'nanoGPT',
    author: 'Andrej Karpathy',
    url: 'https://github.com/karpathy/nanoGPT',
    desc: '最简洁的 GPT 训练代码，值得逐行阅读',
    tag: 'Code',
    color: 'green',
  },
  {
    title: 'Introduction to Operations Research',
    author: 'Hillier & Lieberman',
    url: 'https://www.mheducation.com/highered/product/introduction-operations-research-hillier-lieberman/M9781259872990.html',
    desc: '运筹学经典教材，线性规划到整数规划全覆盖',
    tag: 'Book',
    color: 'purple',
  },
]

// 学习路线时间线
const LEARNING_TIMELINE = [
  { label: '数学基础', desc: '线性代数、微积分、概率统计', icon: <BookOutlined />, color: 'blue' },
  { label: 'PyTorch 基础', desc: '张量运算、自动微分、训练循环', icon: <CodeOutlined />, color: 'green' },
  { label: 'Transformer 架构', desc: 'Attention 机制、位置编码、从零实现', icon: <ExperimentOutlined />, color: 'purple' },
  { label: 'SFT & RLHF', desc: '指令微调、偏好学习、对齐技术', icon: <RocketOutlined />, color: 'orange' },
  { label: 'Agent & 工程化', desc: 'RAG、Tool Use、多 Agent 编排', icon: <RocketOutlined />, color: 'red' },
]

export default function Home() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    getArticles(page, 6)
      .then(res => {
        if (controller.signal.aborted) return
        setArticles(res.data.items)
        setTotal(res.data.total)
      })
      .catch(err => {
        if (err?.name === 'CanceledError' || controller.signal.aborted) return
        setError('文章加载失败，请确认后端服务已启动（localhost:8000）')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [page])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* ===== Hero / 个人简介 ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        borderRadius: 16,
        padding: '64px 48px',
        marginBottom: 48,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 48,
        flexWrap: 'wrap',
      }}>
        <Avatar
          size={120}
          style={{ background: 'linear-gradient(135deg, #1677ff, #7b2ff7)', fontSize: 48, flexShrink: 0 }}
        >
          J
        </Avatar>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Title level={1} style={{ color: '#fff', margin: 0, fontSize: 40 }}>
            XIAO JIYAO
          </Title>
          <Title level={4} style={{ color: '#a78bfa', margin: '8px 0 16px', fontWeight: 400 }}>
            Operations Research Engineer · LLM Researcher · Agent Builder
          </Title>
          <Paragraph style={{ color: '#cbd5e1', fontSize: 15, margin: '0 0 20px', lineHeight: 1.8 }}>
            运筹优化算法工程师，深度学习爱好者。<br />
            跟随 Karpathy 方法论从零实现 Transformer，探索 OR + LLM 的融合边界。<br />
            用 OpenClaw + Claude Code 构建 AI Agent 开发军团，让代码自己写代码。
          </Paragraph>
          <Space wrap>
            {['PyTorch', 'FastAPI', 'LLM', 'Agent', 'OR Optimization', 'OpenClaw'].map((tag, i) => (
              <Tag key={tag} color={TAG_COLORS[i % TAG_COLORS.length]} style={{ fontSize: 13, padding: '2px 10px' }}>
                {tag}
              </Tag>
            ))}
          </Space>
          <div style={{ marginTop: 20 }}>
            <Link href="https://github.com/xiaojiyao777" target="_blank" style={{ color: '#a78bfa', fontSize: 15, marginRight: 24 }}>
              <GithubOutlined style={{ marginRight: 6 }} />GitHub
            </Link>
          </div>
        </div>
      </div>

      {/* ===== 最新文章 ===== */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Title level={3} style={{ margin: 0 }}>📝 最新文章</Title>
      </div>

      {error && (
        <Alert type="warning" message={error} showIcon style={{ marginBottom: 24 }} />
      )}

      <Spin spinning={loading}>
        {!loading && !error && articles.length === 0 ? (
          <Empty description="暂无文章，后端服务启动后刷新页面" style={{ padding: '40px 0' }} />
        ) : (
          <Row gutter={[24, 24]}>
            {articles.map(article => (
              <Col xs={24} sm={12} lg={8} key={article.id}>
                <Card
                  hoverable
                  style={{ height: '100%', borderRadius: 12 }}
                  styles={{ body: { height: '100%', display: 'flex', flexDirection: 'column' } }}
                  onClick={() => navigate(`/articles/${article.id}`)}
                >
                  <Space style={{ marginBottom: 10 }}>
                    {article.tags.slice(0, 2).map((tag, i) => (
                      <Tag key={tag} color={TAG_COLORS[i % TAG_COLORS.length]}>{tag}</Tag>
                    ))}
                  </Space>
                  <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>{article.title}</Title>
                  <Paragraph ellipsis={{ rows: 3 }} style={{ color: '#666', flex: 1, marginBottom: 12 }}>
                    {article.summary}
                  </Paragraph>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {total > 6 && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Pagination current={page} total={total} pageSize={6} onChange={setPage} showSizeChanger={false} />
        </div>
      )}

      <Divider style={{ margin: '48px 0 40px' }} />

      {/* ===== Karpathy 风格学习路线 ===== */}
      <Title level={3} style={{ marginBottom: 32 }}>🗺️ LLM 学习路线</Title>
      <Card style={{ borderRadius: 12, marginBottom: 48 }}>
        <Timeline
          items={LEARNING_TIMELINE.map(item => ({
            color: item.color,
            dot: item.icon,
            children: (
              <div style={{ paddingBottom: 8 }}>
                <Text strong style={{ fontSize: 15 }}>{item.label}</Text>
                <br />
                <Text type="secondary">{item.desc}</Text>
              </div>
            ),
          }))}
        />
      </Card>

      {/* ===== 精选资源 ===== */}
      <Title level={3} style={{ marginBottom: 24 }}>📚 精选学习资源</Title>
      <Row gutter={[20, 20]} style={{ marginBottom: 48 }}>
        {LEARNING_RESOURCES.map(res => (
          <Col xs={24} sm={12} lg={8} key={res.title}>
            <Card
              hoverable
              size="small"
              style={{ borderRadius: 12, height: '100%' }}
              onClick={() => window.open(res.url, '_blank')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Tag color={res.color}>{res.tag}</Tag>
              </div>
              <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>{res.title}</Text>
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>— {res.author}</Text>
              <Paragraph style={{ fontSize: 13, color: '#555', margin: 0 }} ellipsis={{ rows: 2 }}>
                {res.desc}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

    </div>
  )
}
