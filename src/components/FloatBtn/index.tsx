import {
  DeleteOutlined,
  EditOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
import { handleDeleteClick } from './controller'
import useCollapsed from '../../hooks/useCollapsed'
import { useParams, useNavigate } from 'react-router-dom'
import useUpdatePatients from '../../hooks/useUpdatePatients'
import useUpdateLabs from '../../hooks/useUpdateLabs'
import { FloatButton, Popconfirm } from 'antd'
import useMsgApi from '../../hooks/useMsgApi'
import { useEffect, useState } from 'react'
import useLabs from '../../hooks/useLabs'
import { AxiosError } from 'axios'
import Icon from '../Icon'
import './style.css'

export default function FloatBtn(children: React.ReactNode) {
  return <>{children}</>
}

interface LocalFloatButtonProps {
  onEditClick: () => void
  deleteType: 'lab' | 'stretcher'
}

FloatBtn.Options = function Options({
  onEditClick,
  deleteType,
}: LocalFloatButtonProps) {
  const labs = useLabs()
  const { id } = useParams()
  const msgApi = useMsgApi()
  const collapsed = useCollapsed()
  const navigateTo = useNavigate()
  const updateLabs = useUpdateLabs()
  const updatePatients = useUpdatePatients()

  if (!id) return

  const handleOpen = (open: boolean) => {
    const el = document.querySelector('.float-btn.lab-form') as HTMLElement
    if (open) {
      el.dataset.open = 'true'
    } else {
      el.dataset.open = 'false'
    }
  }
  const handleDelete = () => {
    handleDeleteClick(id, msgApi, deleteType).then((res) => {
      if (!(res instanceof AxiosError)) {
        msgApi.open({
          content: 'Actualizando repositorio...',
          duration: 0,
          key: 'update-partial-repo',
          type: 'loading',
        })
        Promise.all([updateLabs(), updatePatients()])
          .then(() => {
            const to = labs.find((lab) => lab._id !== id)?._id
            if (to) navigateTo('/laboratorio/' + to)
            else navigateTo('/pacientes')
          })
          .finally(() => msgApi.destroy('update-partial-repo'))
      }
    })
  }

  return (
    <FloatButton.Group
      type="primary"
      trigger="click"
      className="float-btn lab-form"
      onOpenChange={handleOpen}
      icon={<Icon.Sync />}
      style={!collapsed ? { left: 220 } : { left: 100 }}
    >
      <FloatButton onClick={onEditClick} icon={<EditOutlined />} />
      <Popconfirm
        title={`¿Estás seguro de eliminar ${
          deleteType === 'lab' ? 'este laboratorio' : 'esta cama'
        }?`}
        placement="rightBottom"
        onConfirm={handleDelete}
        cancelText="No"
        okText="Sí"
      >
        <FloatButton icon={<DeleteOutlined />} />
      </Popconfirm>
    </FloatButton.Group>
  )
}

FloatBtn.ToTop = function ToTop() {
  const collapsed = useCollapsed()
  const [isVisible, setIsVisible] = useState(false)

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!isVisible && window.scrollY >= 400) {
        setIsVisible(true)
      } else if (isVisible && window.scrollY < 400) {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible])

  return (
    <>
      {isVisible && (
        <FloatButton
          type="default"
          onClick={handleClick}
          tooltip="Volver arriba"
          className="float-btn to-top"
          icon={<VerticalAlignTopOutlined />}
          style={!collapsed ? { left: 220 } : { left: 100 }}
        />
      )}
    </>
  )
}
