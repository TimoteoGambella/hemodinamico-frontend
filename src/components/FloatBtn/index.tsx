import { DeleteOutlined, EditOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'
import useCollapsed from '../../hooks/useCollapsed'
import { useEffect, useState } from 'react'
import { FloatButton } from 'antd'
import Icon from '../Icon'
import './style.css'

export default function FloatBtn(children: React.ReactNode) {
  return <>{children}</>
}

interface LocalFloatButtonProps {
  onEditClick: () => void
}

FloatBtn.Options = function Options({ onEditClick }: LocalFloatButtonProps) {
  const collapsed = useCollapsed()

  const handleOpen = (open: boolean) => {
    const el = document.querySelector('.float-btn.lab-form') as HTMLElement
    if (open) {
      el.dataset.open = 'true'
    } else {
      el.dataset.open = 'false'
    }
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
      <FloatButton icon={<DeleteOutlined />} />
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
          className='float-btn to-top'
          icon={<VerticalAlignTopOutlined />}
          style={!collapsed ? { left: 220 } : { left: 100 }}
        />
      )}
    </>
  )
}
