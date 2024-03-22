import * as AntIcon from '@ant-design/icons'
import { Space, Typography } from 'antd'
import Icon from '../Icon'

interface CardProps {
  title: React.ReactNode
  text: React.ReactNode
  icon?: 'user' | 'stretcher' | 'flask' | 'patients'
  color?: `rgb(${number}, ${number}, ${number})`
  style?: {
    title?: React.CSSProperties
    text?: React.CSSProperties
  }
}

export default function Card(props: CardProps) {
  const titleStyle = props.style?.title || {}
  const textStyle = props.style?.text || {}
  let style = {}

  if (props.color && !props.icon) {
    console.error('Icon is required when color is provided')
    return null
  }

  if (props.color) {
    const colors = props.color.match(/\d+/g)!.map(Number)

    style = {
      background: `linear-gradient(0deg, rgb(${colors[0] - 100}, ${
        colors[1] - 60
      }, ${colors[2] - 40}) 10%, ${props.color} 100%)`,
      boxShadow: `rgb(${colors.join(',')}, 0.8) 1px 1px 5px 0px`,
      color: '#fff',
    }
  }

  let icon: JSX.Element | undefined

  if (props.icon) {
    switch (props.icon) {
      case 'user':
        icon = (
          <AntIcon.UserOutlined
            className="dash-card-icon"
            style={{ color: 'white', height: 10 }}
          />
        )
        break
      case 'stretcher':
        icon = (
          <Icon.Stretcher
            className="dash-card-icon"
            style={{ color: 'white' }}
            height={10}
          />
        )
        break
      case 'flask':
        icon = (
          <Icon.Flask
            className="dash-card-icon"
            style={{ color: 'white' }}
            height={10}
          />
        )
        break
      case 'patients':
        icon = (
          <AntIcon.TeamOutlined
            className="dash-card-icon"
            style={{ color: 'white' }}
            height={10}
          />
        )
        break
      default:
        console.error('Invalid icon provided')
        return null
    }
  }

  return (
    <Space className="dash-card" direction="vertical">
      <div className="dash-card-content">
        <Typography.Title level={2} style={titleStyle}>
          {props.title}
        </Typography.Title>
        <Typography.Text style={textStyle}>{props.text}</Typography.Text>
        {props.icon && (
          <div className="dash-card-icon-container" style={style}>
            {icon}
          </div>
        )}
      </div>
    </Space>
  )
}
