import { MsgApiContext } from '../../contexts/MsgApiProvider'
import { useContext, useEffect, useState } from 'react'
import { Button, Layout, Menu, Spin } from 'antd'
import {
  Navigate,
  Route,
  Routes as Switch,
  useLocation,
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
  const [collapsed, setCollapsed] = useState(
    window.document.body.clientWidth <= 768
  )
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const { msgApi, contextHolder } = useContext(MsgApiContext)
  const [defaultSelectedKey, setDefaultSelectedKey] = useState(['dashboard'])
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { handleLogout, renderMenuItems } = Controller
  const navigateTo = useNavigate()
  const location = useLocation()

  useEffect(() => {
    Controller.handleUnAuth(navigateTo, setIsAuthChecked)
  }, [navigateTo])

  useEffect(() => {
    Controller.getItems()
      .then((items) => {
        setItems(items)
        setIsLoading(false)
      })
      .catch(() => {
        msgApi!.error('Error al cargar el menú. Inténtelo de nuevo más tarde.')
      })
  }, [msgApi])

  useEffect(() => {
    const handleResize = () => {
      if (!collapsed && window.document.body.clientWidth <= 768)
        setCollapsed(true)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [collapsed])

  useEffect(() => {
    Controller.selectDefaultController(location.pathname, setDefaultSelectedKey)
  }, [location])

  if (!isAuthChecked) {
    return null
  }

  return (
    <>
      <Spin spinning={isLoading} tip="Cargando..." fullscreen></Spin>
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
            onClick={() => handleLogout(msgApi!, navigateTo)}
            danger
          >
            Cerrar sesión
          </Button>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={defaultSelectedKey}
            items={items.map((item) => renderMenuItems(item))}
          />
        </Sider>
        <Layout>
          <Content>
            <Switch>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/pacientes" element={<Patients />} />
              <Route path="/cama/:id" element={<Stretcher />} />
              <Route
                path="/laboratorio/:id"
                element={<Laboratory collapsed={collapsed} />}
              />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
