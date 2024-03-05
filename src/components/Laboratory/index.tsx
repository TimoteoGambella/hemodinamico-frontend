import useMsgApi from '../../hooks/useMsgApi'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useLabs from '../../hooks/useLabs'
import { Empty, Spin, Tabs } from 'antd'
import LabContent from './LabContent'
import './style.css'

const Laboratory = () => {
  const { id } = useParams()
  const msgApi = useMsgApi()
  const [shouldRender] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const data = useLabs().find((lab) => lab._id === id)

  const tabs = [
    {
      label: 'Información general',
      key: '0',
      children: (
        <Spin spinning={isLoading}>
          {shouldRender && data ? (
            <LabContent data={data} msgApi={msgApi} />
          ) : (
            <Empty description="Sin datos" />
          )}
        </Spin>
      ),
    },
    {
      label: 'Resumen',
      key: '1',
      children: <Empty description="Sin datos" />,
    },
    {
      label: 'Gráficos y tendencias',
      key: '2',
      children: <Empty description="Sin datos" />,
    }
  ]

  useEffect(() => {
    if (data) setIsLoading(false)
  }, [data])

  return <Tabs type="card" items={tabs} />
}

export default Laboratory
