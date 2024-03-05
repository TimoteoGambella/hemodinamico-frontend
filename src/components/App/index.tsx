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
import { CollapseContext } from '../../contexts/CollapseProvider'
import useLoginStatus from '../../hooks/useLoginStatus'
import useStretchers from '../../hooks/useStretchers'
import useUserInfo from '../../hooks/useUserInfo'
import * as Controller from './controller'
import useLabs from '../../hooks/useLabs'
import Laboratory from '../Laboratory'
import Dashboard from '../Dashboard'
import Stretcher from '../Stretcher'
import Patients from '../Patients'
import Users from '../Users'
import Icon from '../Icon'
import './index.css'

const { Content, Sider } = Layout

const App = () => {
  const [defaultSelectedKey, setDefaultSelectedKey] = useState(['dashboard'])
  const { isCollapsed, setIsCollapsed } = useContext(CollapseContext)
  const { msgApi, contextHolder } = useContext(MsgApiContext)
  const { handleLogout, renderMenuItems } = Controller
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const stretchers = useStretchers()
  const isLogged = useLoginStatus()
  const navigateTo = useNavigate()
  const location = useLocation()
  const authUser = useUserInfo()
  const labs = useLabs()

  useEffect(() => {
    if (!stretchers || !labs) return
    Controller.getItems({
      reqStretchers: stretchers,
      reqLabs: labs,
      isAdmin: authUser?.isAdmin ?? false,
    })
      .then((items) => {
        setItems(items)
        setIsLoading(false)
      })
      .catch(() => {
        msgApi!.error('Error al cargar el menú. Inténtelo de nuevo más tarde.')
      })
  }, [msgApi, stretchers, labs, authUser])

  useEffect(() => {
    Controller.selectDefaultController(location.pathname, setDefaultSelectedKey)
  }, [location])

  if (!isLogged) return null

  return (
    <>
      <Spin spinning={isLoading} tip="Cargando..." fullscreen></Spin>
      {contextHolder}
      <Layout>
        <Sider
          collapsible
          collapsed={isCollapsed}
          onCollapse={(value) => setIsCollapsed(value)}
        >
          <Button
            icon={<Icon.CloseSession />}
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
              <Route path="/laboratorio/:id" element={<Laboratory />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
