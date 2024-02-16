import { useEffect, useState } from 'react'
import { Button, Layout, Menu, message } from 'antd'
import {
  Navigate,
  Route,
  Routes as Switch,
  useNavigate,
} from 'react-router-dom'
import * as Controller from './controller'
import Laboratory from '../Laboratory'
import Dashboard from '../Dashboard'
import Stretcher from '../Stretcher'
import Patients from '../Patients'
import Users from '../Users'
import Icon from '../Icon'
import './index.css'

const { Content, Sider } = Layout

const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [msgApi, contextHolder] = message.useMessage()
  const [defaultSelectedKey, setDefaultSelectedKey] = useState('dashboard')
  const [items, setItems] = useState<MenuItem[]>([])
  const { handleLogout, renderMenuItems } = Controller
  const navigateTo = useNavigate()

  useEffect(() => {
    Controller.handleUnAuth(navigateTo, setIsAuthChecked)
  }, [navigateTo])

  useEffect(() => {
    Controller.getItems().then((items) => {
      setItems(items)
    }).catch(() => {
      msgApi.error('Error al cargar el menú. Inténtelo de nuevo más tarde.')
    })
  }, [msgApi])

  useEffect(() => {
    Controller.selectDefaultController(setDefaultSelectedKey)
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
              <Route path="/pacientes" element={<Patients msgApi={msgApi} />} />
              <Route path="/cama/:id" element={<Stretcher msgApi={msgApi} />} />
              <Route path="/laboratorio/:id" element={<Laboratory msgApi={msgApi} />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
