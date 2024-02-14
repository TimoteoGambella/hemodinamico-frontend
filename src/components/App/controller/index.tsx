import { AxiosError } from 'axios'
import { Link, NavigateFunction } from 'react-router-dom'
import { MessageInstance } from 'antd/es/message/interface'
import AxiosController from '../../../utils/axios.controller'

const axios = new AxiosController()

export function getItem(
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
      children: item.children.map((child) => renderMenuItems(child, String(item.key))),
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

export async function handleLogout(msgApi: MessageInstance, navigateTo: NavigateFunction){
  const res = await axios.logout()
  if (res instanceof AxiosError) {
    msgApi.error('Error al cerrar sesión. Inténtelo de nuevo más tarde.')
  } else {
    navigateTo('/login')
  }
}
