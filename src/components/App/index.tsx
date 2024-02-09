import {
  PieChartOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { useState } from 'react'
import { Navigate, Route, Routes as Switch } from 'react-router-dom'
import Users from '../Users'
import Dashboard from '../Dashboard'
import { getItem, renderMenuItems } from './controller'
import './index.css'

const { Content, Sider } = Layout
const items: MenuItem[] = [
  getItem('Dashboard', 'dashboard', <PieChartOutlined />),
  getItem('Usuarios', 'usuarios', <TeamOutlined />),
  getItem('Pacientes', 'pacientes', <TeamOutlined />),
  getItem('Camillas', 'camilla', <AppstoreOutlined />, [
    getItem('Paciente Tom', '1', <SolutionOutlined />),
    getItem('Paciente Bill', '2', <SolutionOutlined />),
    getItem('Paciente Alex', '3', <SolutionOutlined />),
  ]),
]

const App = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline">
          {items.map((item) => renderMenuItems(item))}
        </Menu>
      </Sider>
      <Layout>
        <Content>
          <Switch>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
