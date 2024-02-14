import {
  PieChartOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Button, Layout, Menu, message } from 'antd'
import {
  Navigate,
  Route,
  Routes as Switch,
  useNavigate,
} from 'react-router-dom'
import { getItem, handleLogout, renderMenuItems } from './controller'
import AxiosController from '../../utils/axios.controller'
import Dashboard from '../Dashboard'
import Users from '../Users'
import Icon from '../Icon'
import './index.css'

const { Content, Sider } = Layout
const axios = new AxiosController()
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
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [msgApi, contextHolder] = message.useMessage()
  const [defaultSelectedKey, setDefaultSelectedKey] = useState('dashboard')
  const navigateTo = useNavigate()

  useEffect(() => {
    axios.checkAuth().then((isAuth) => {
      if (!isAuth) navigateTo('/login')
      setIsAuthChecked(true)
    })
  }, [navigateTo])

  useEffect(() => {
    const path = window.location.pathname.split('/')[1]
    if (path) setDefaultSelectedKey(path)
  }, [])

  if (!isAuthChecked) {
    return null
  }

  return (
    <>
      {contextHolder}
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Button
            icon={<Icon.CloseSessionIcon />}
            className="logo-vertical"
            type="primary"
            onClick={() => handleLogout(msgApi, navigateTo)}
            danger
          >
            Cerrar sesión
          </Button>
          <Menu
            theme="dark"
            defaultSelectedKeys={[defaultSelectedKey]}
            mode="inline"
            items={items.map((item) => renderMenuItems(item))}
          />
        </Sider>
        <Layout>
          <Content>
            <Switch>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/usuarios" element={<Users msgApi={msgApi} />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
