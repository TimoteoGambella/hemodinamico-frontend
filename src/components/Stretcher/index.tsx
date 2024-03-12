import StretcherSummary from './components/StretcherSummary'
import StretcherContent from './components/StretcherContent'
import useStretchers from '../../hooks/useStretchers'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Empty, Spin, Tabs } from 'antd'
import './style.css'

const Stretcher = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const stretcherData = useStretchers()?.find(
    (stretcher) => stretcher._id === id
  ) as PopulatedStretcher

  const tabs = [
    {
      label: 'Información general',
      key: '0',
      children: (
        <Spin spinning={isLoading}>
          {stretcherData ? (
            <StretcherContent stretcherData={stretcherData} />
          ) : (
            <Empty description="Sin datos" />
          )}
        </Spin>
      ),
    },
    {
      label: 'Resumen',
      key: '1',
      children: stretcherData ? (
        <StretcherSummary stretcher={stretcherData} />
      ) : (
        <Empty description="Sin datos" />
      ),
    },
  ]

  useEffect(() => {
    if (stretcherData) setIsLoading(false)
  }, [stretcherData])

  return <Tabs type="card" items={tabs} />
}

export default Stretcher
