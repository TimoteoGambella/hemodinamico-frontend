import {
  PieChartOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  TeamOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import { AxiosError } from 'axios'
import { Link, NavigateFunction } from 'react-router-dom'
import { MessageInstance } from 'antd/es/message/interface'
import AxiosController from '../../../utils/axios.controller'
import Icon from '../../Icon'
import routeSchema from '../constants/routeSchema'

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

export function renderMenuItems(
  item: MenuItem,
  previousKey?: string
): MenuItem {
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

export async function handleLogout(
  msgApi: MessageInstance,
  navigateTo: NavigateFunction
) {
  const res = await axios.logout()
  if (res instanceof AxiosError) {
    msgApi.error('Error al cerrar sesión. Inténtelo de nuevo más tarde.')
  } else {
    navigateTo('/login')
  }
}

interface GetItemsProps {
  reqStretchers: StretcherData[] | PopulatedStretcher[] | AxiosError
  reqLabs: LaboratoryData[] | PopulatedLab[] | AxiosError
  isAdmin: boolean
}

export async function getItems({
  reqStretchers,
  reqLabs,
  isAdmin,
}: GetItemsProps): Promise<MenuItem[]> {
  return await new Promise((resolve, reject) => {
    if (reqStretchers instanceof AxiosError) return reject([])
    if (reqLabs instanceof AxiosError) return reject([])
    const stretchers = reqStretchers.map((stretcher) =>
      getItem(
        stretcher.label ?? stretcher._id,
        stretcher._id,
        <SolutionOutlined />
      )
    )
    const laboratories = reqLabs.map((lab) =>
      getItem(
        typeof lab.patientId === 'string'
          ? lab.patientId
          : lab.patientId?.fullname ?? lab._id,
        lab._id,
        <SolutionOutlined />
      )
    )

    const items = [
      getItem(
        routeSchema.dashboard.label,
        routeSchema.dashboard.path.slice(1),
        <PieChartOutlined />
      ),
      getItem(
        routeSchema.patients.label,
        routeSchema.patients.path.slice(1),
        <TeamOutlined />
      ),
      getItem(
        routeSchema.labs.label,
        routeSchema.labs.path.slice(1),
        <Icon.Flask />,
        laboratories
      ),
      getItem(
        routeSchema.stretchers.label,
        routeSchema.stretchers.path.slice(1),
        <AppstoreOutlined />,
        stretchers
      ),
    ]

    if (isAdmin) {
      items.splice(
        1,
        0,
        getItem(
          routeSchema.users.label,
          routeSchema.users.path.slice(1),
          <TeamOutlined />
        )
      )
      items.splice(
        items.length,
        0,
        getItem(
          routeSchema.report.label,
          routeSchema.report.path.slice(1),
          <DatabaseOutlined />
        )
      )
    }
    return resolve(items)
  })
}

export function selectDefaultController(
  pathname: string,
  setSelected: (_: string[]) => void
) {
  const path = pathname.split('/')
  if (path[1] === 'cama' || path[1] === 'laboratorio') path.shift()
  if (path) setSelected([path[1]])
}
