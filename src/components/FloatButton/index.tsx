import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import useCollapsed from '../../hooks/useCollapsed'
import { FloatButton } from 'antd'
import Icon from '../Icon'

interface LocalFloatButtonProps {
  onEditClick: () => void
}

const FormFloatButton = ({ onEditClick }: LocalFloatButtonProps) => {
  const collapsed = useCollapsed()

  const handleOpen = (open: boolean) => {
    const el = document.querySelector('.float-btn-lab-form') as HTMLElement
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
      className="float-btn-lab-form"
      onOpenChange={handleOpen}
      icon={<Icon.Sync />}
      style={!collapsed ? { left: 220 } : { left: 100 }}
    >
      <FloatButton onClick={onEditClick} icon={<EditOutlined />} />
      <FloatButton icon={<DeleteOutlined />} />
    </FloatButton.Group>
  )
}

export default FormFloatButton
