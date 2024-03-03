import useStretchers from '../../hooks/useStretchers'
import StretcherContent from './StretcherContent'
import useMsgApi from '../../hooks/useMsgApi'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Empty, Spin, Tabs } from 'antd'
import './style.css'

const Stretcher = () => {
  const { id } = useParams()
  const msgApi = useMsgApi()
  const [isLoading, setIsLoading] = useState(true)
  const stretcherData = useStretchers()?.find(
    (stretcher) => stretcher._id === id
  )

  const tabs = [
    {
      label: 'Información general',
      key: '0',
      children: (
        <Spin spinning={isLoading}>
          {stretcherData ? (
            <StretcherContent stretcherData={stretcherData} msgApi={msgApi} />
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
  ]

  useEffect(() => {
    if (stretcherData) setIsLoading(false)
  }, [stretcherData])

  return <Tabs type="card" items={tabs} />
}

export default Stretcher
