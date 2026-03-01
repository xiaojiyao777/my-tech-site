import { Layout, Menu, Typography } from 'antd'
import { CodeOutlined, HomeOutlined, ReadOutlined } from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const { Header, Content, Footer } = Layout
const { Title } = Typography

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/articles', icon: <ReadOutlined />, label: '文章' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <CodeOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          <Title level={4} style={{ color: '#fff', margin: 0 }}>JIYAO · Tech</Title>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, borderBottom: 'none' }}
        />
      </Header>
      <Content style={{ padding: '48px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center', color: '#888' }}>
        JIYAO · Tech © {new Date().getFullYear()} · Built with Agent Swarm 🤖
      </Footer>
    </Layout>
  )
}
