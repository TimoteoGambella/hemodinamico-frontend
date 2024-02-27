import AntIcon from '@ant-design/icons'
import { GetProps } from 'antd'
import CloseSession from './assets/CloseSession'
import Flask from './assets/Flask'
import Sync from './assets/Sync'

type CustomIconComponentProps = GetProps<typeof AntIcon>

Icon.CloseSession = (props: CustomIconComponentProps) => (
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

Icon.Flask = (props: CustomIconComponentProps) => (
  <AntIcon
    component={() => (
      <Flask
        width={props.width}
        height={props.height}
        style={props.style}
      />
    )}
    {...props}
  />
)

Icon.Sync = (props: CustomIconComponentProps) => (
  <AntIcon
    component={() => (
      <Sync
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
