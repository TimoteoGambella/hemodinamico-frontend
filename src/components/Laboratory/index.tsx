import useMsgApi from '../../hooks/useMsgApi'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useLabs from '../../hooks/useLabs'
import { Empty, Spin, Tabs } from 'antd'
import LabContent from './LabContent'
import './style.css'

const Laboratory = () => {
  const labs = useLabs()
  const { id } = useParams()
  const msgApi = useMsgApi()
  const navigateTo = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<LaboratoryData | null>(null)
  const tabs = [
    {
      label: 'Información general',
      key: 'general-info',
      children: (
        <Spin spinning={isLoading}>
          {data ? (
            <LabContent data={data} msgApi={msgApi} />
          ) : (
            <Empty description="Sin datos" />
          )}
        </Spin>
      ),
    },
    {
      label: 'Resumen',
      key: 'summary',
      children: <Empty description="Sin datos" />,
    },
    {
      label: 'Gráficos y tendencias',
      key: 'graphs-trends',
      children: <Empty description="Sin datos" />,
    },
  ]

  useEffect(() => {
    const res = labs.find((lab) => lab._id === id) || null
    setData(res)
    setIsLoading(false)
  }, [id, labs])

  useEffect(() => {
    if (!data && !isLoading && id && labs.length > 0) {
      const res = labs.find((lab) => lab._id === id)
      if (!res) navigateTo('/404')
    }
  }, [data, id, isLoading, labs, navigateTo])

  return <Tabs type="card" items={tabs} />
}

export default Laboratory
