import { CollapseContext } from '../../contexts/CollapseProvider'
import { MsgApiContext } from '../../contexts/MsgApiProvider'
import { useContext, useEffect, useState } from 'react'
import useLoginStatus from '../../hooks/useLoginStatus'
import useStretchers from '../../hooks/useStretchers'
import useUserInfo from '../../hooks/useUserInfo'
import { Button, Layout, Menu, Spin } from 'antd'
import routeSchema from './constants/routeSchema'
import * as Controller from './controller'
import * as Router from 'react-router-dom'
import useLabs from '../../hooks/useLabs'
import Laboratory from '../Laboratory'
import Dashboard from '../Dashboard'
import Stretcher from '../Stretcher'
import Patients from '../Patients'
import Database from '../Report'
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

  useEffect(() => {
    const loader = document.querySelector('#mainLoader')
    if (loader) loader.remove()
  }, [])

  if (!isLogged) return <Spin spinning tip="Cargando..." fullscreen />

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
                element={
                  <Router.Navigate to={routeSchema.dashboard.path} replace />
                }
              />
              <Router.Route
                path={routeSchema.dashboard.path}
                element={<Dashboard />}
              />
              <Router.Route path={routeSchema.users.path} element={<Users />} />
              <Router.Route
                path={routeSchema.patients.path}
                element={<Patients />}
              />
              <Router.Route
                path={`${routeSchema.stretchers.path}/:id`}
                element={<Stretcher />}
              />
              <Router.Route
                path={routeSchema.report.path}
                element={<Database />}
              />
              <Router.Route
                path={`${routeSchema.labs.path}/:id`}
                element={<Laboratory />}
              />
              <Router.Route
                path="*"
                element={
                  <Router.Navigate to={routeSchema.notFound.path} replace />
                }
              />
            </Router.Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
