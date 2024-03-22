import CloseSession from './assets/CloseSession'
import Stretcher from './assets/Stretcher'
import AntIcon from '@ant-design/icons'
import Flask from './assets/Flask'
import Sync from './assets/Sync'
import { GetProps } from 'antd'

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
      <Flask width={props.width} height={props.height} style={props.style} />
    )}
    {...props}
  />
)

Icon.Sync = (props: CustomIconComponentProps) => (
  <AntIcon
    component={() => (
      <Sync width={props.width} height={props.height} style={props.style} />
    )}
    {...props}
  />
)

Icon.Stretcher = (props: CustomIconComponentProps) => (
  <AntIcon
    component={() => (
      <Stretcher
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
