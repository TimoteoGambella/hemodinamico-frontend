import {
  PieChartOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { AxiosError } from 'axios'
import { Link, NavigateFunction } from 'react-router-dom'
import { MessageInstance } from 'antd/es/message/interface'
import AxiosController from '../../../utils/axios.controller'

const axios = new AxiosController()

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
) {
  return {
    key,
    icon,
    children,
    label,
  }
}

export function renderMenuItems(item: MenuItem, previousKey?: string): MenuItem {
  const generateLink = () => {
    if (previousKey) return `${previousKey}/${item.key}`
    return `/${item.key}`
  }

  if (item.children) {
    return {
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children.map((child) =>
        renderMenuItems(child, String(item.key))
      ),
    }
  } else {
    return {
      key: item.key,
      icon: item.icon,
      label: (
        <Link to={generateLink()}>
          <span>{item.label}</span>
        </Link>
      ),
    }
  }
}

export async function handleUnAuth(navigateTo: NavigateFunction, setIsAuthChecked: (value: boolean) => void) {
  axios.checkAuth().then((isAuth) => {
    if (!isAuth) navigateTo('/login')
    setIsAuthChecked(true)
  })
}

export async function handleLogout(msgApi: MessageInstance, navigateTo: NavigateFunction) {
  const res = await axios.logout()
  if (res instanceof AxiosError) {
    msgApi.error('Error al cerrar sesión. Inténtelo de nuevo más tarde.')
  } else {
    navigateTo('/login')
  }
}

export async function getItems(): Promise<MenuItem[]> {
  return new Promise((resolve, reject) => {
    axios
      .getStretchers(true)
      .then((res) => {
        if (res instanceof AxiosError) return reject([])
        const stretchers = (res.data.data as StretcherData[]).map((stretcher) =>
          getItem(
            stretcher.label ?? stretcher._id,
            stretcher._id,
            <SolutionOutlined />
          )
        )
        return resolve([
          getItem('Dashboard', 'dashboard', <PieChartOutlined />),
          getItem('Usuarios', 'usuarios', <TeamOutlined />),
          getItem('Pacientes', 'pacientes', <TeamOutlined />),
          getItem('Camillas', 'camilla', <AppstoreOutlined />, stretchers),
        ])
      })
      .catch(() => reject([]))
  })
}
