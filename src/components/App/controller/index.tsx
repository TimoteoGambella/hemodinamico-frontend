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
import Icon from '../../Icon'

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

export async function handleLogout(msgApi: MessageInstance, navigateTo: NavigateFunction) {
  const res = await axios.logout()
  if (res instanceof AxiosError) {
    msgApi.error('Error al cerrar sesión. Inténtelo de nuevo más tarde.')
  } else {
    navigateTo('/login')
  }
}

export async function getItems(reqStretchers: StretcherData[], reqLabs: LaboratoryData[]): Promise<MenuItem[]> {
  return await new Promise((resolve, reject) => {
    if (reqStretchers instanceof AxiosError) return reject([])
    if (reqLabs instanceof AxiosError) return reject([])
    const stretchers = (reqStretchers).map((stretcher) =>
      getItem(
        stretcher.label ?? stretcher._id,
        stretcher._id,
        <SolutionOutlined />
      )
    )
    const laboratories = (reqLabs).map((lab) =>
      getItem(
        typeof lab.patientId === 'string' ? lab.patientId : lab.patientId.fullname ?? lab._id,
        lab._id,
        <SolutionOutlined />
      )
    )
    return resolve([
      getItem('Dashboard', 'dashboard', <PieChartOutlined />),
      getItem('Usuarios', 'usuarios', <TeamOutlined />),
      getItem('Pacientes', 'pacientes', <TeamOutlined />),
      getItem('Laboratorio', 'laboratorio', <Icon.Flask />, laboratories),
      getItem('Camas', 'cama', <AppstoreOutlined />, stretchers),
    ])
  })
}

export function selectDefaultController(pathname: string, setSelected: (_: string[]) => void){
  const path = pathname.split('/')
  if(path[1] === 'cama' || path[1] === 'laboratorio') path.shift()
  if (path) setSelected([path[1]])
}
