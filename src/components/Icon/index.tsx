import AntIcon from '@ant-design/icons'
import { GetProps } from 'antd'
import CloseSession from './assets/CloseSession'

type CustomIconComponentProps = GetProps<typeof AntIcon>

Icon.CloseSessionIcon = (props: CustomIconComponentProps) => (
  <AntIcon
    component={() => (
      <CloseSession
        width={props.width}
        height={props.height}
        style={props.style}
      />
    )}
    {...props}
  />
)

export default function Icon(children: React.ReactNode) {
  return <>{children}</>
}
