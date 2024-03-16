import { CollapseContext } from '../../contexts/CollapseProvider'
import { MsgApiContext } from '../../contexts/MsgApiProvider'
import { useContext, useEffect, useState } from 'react'
import useLoginStatus from '../../hooks/useLoginStatus'
import useStretchers from '../../hooks/useStretchers'
import useUserInfo from '../../hooks/useUserInfo'
import { Button, Layout, Menu, Spin } from 'antd'
import * as Controller from './controller'
import * as Router from 'react-router-dom'
import useLabs from '../../hooks/useLabs'
import Laboratory from '../Laboratory'
import Dashboard from '../Dashboard'
import Stretcher from '../Stretcher'
import Patients from '../Patients'
import Database from '../Database'
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
  const navigateTo = Router.useNavigate()
  const location = Router.useLocation()
  const stretchers = useStretchers()
  const isLogged = useLoginStatus()
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
            <Router.Routes>
              <Router.Route
                path="/"
                element={<Router.Navigate to="/dashboard" replace />}
              />
              <Router.Route path="/dashboard" element={<Dashboard />} />
              <Router.Route path="/usuarios" element={<Users />} />
              <Router.Route path="/pacientes" element={<Patients />} />
              <Router.Route path="/cama/:id" element={<Stretcher />} />
              <Router.Route path="/database" element={<Database />} />
              <Router.Route path="/laboratorio/:id" element={<Laboratory />} />
              <Router.Route
                path="*"
                element={<Router.Navigate to="/404" replace />}
              />
            </Router.Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
