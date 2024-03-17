import StretcherSummary from './components/StretcherSummary'
import StretcherContent from './components/StretcherContent'
import StretcherTrends from './components/StretcherTrends'
import useStretchers from '../../hooks/useStretchers'
import { getStretcherVersions } from './controller'
import useMsgApi from '../../hooks/useMsgApi'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Empty, Spin, Tabs } from 'antd'
import { AxiosError } from 'axios'
import './style.css'

const Stretcher = () => {
  const { id } = useParams()
  const msgApi = useMsgApi()
  const [currentTab, setCurrentTab] = useState<TabsKeys>('general-info')
  const [isLoading, setIsLoading] = useState(true)
  const stretcherData = useStretchers()?.find(
    (stretcher) => stretcher._id === id
  ) as PopulatedStretcher
  const [versions, setVersions] = useState<PopulatedStretcher[] | null>(null)

  const tabs: TabType[] = [
    {
      label: 'Información general',
      key: 'general-info',
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
      key: 'summary',
      children: stretcherData ? (
        <StretcherSummary
          stretcher={versions}
          currentTab={currentTab}
          patient={stretcherData.patientId!._id}
        />
      ) : (
        <Empty description="Sin datos" />
      ),
    },
    {
      label: 'Gráficos',
      key: 'graphs-trends',
      children: stretcherData ? (
        <StretcherTrends currentTab={currentTab} versions={versions} />
      ) : (
        <Empty description="Sin datos" />
      ),
    },
  ]

  useEffect(() => {
    if (stretcherData) setIsLoading(false)
  }, [stretcherData])

  useEffect(() => {
    if (!id) return
    const fetchVersions = async () => {
      const res = await getStretcherVersions(id)
      if (res instanceof AxiosError) {
        msgApi.error(
          (res.response?.data as { message: string })?.message ||
            'Error al obtener versiones'
        )
        return
      }
      const versions = (res.data.data as PopulatedStretcher[]).filter(
        (stretcher) => stretcher.patientId && stretcher.patientHeartRate
      )
      setVersions(versions.map((stretcher, i) => ({ ...stretcher, key: i })))
    }
    fetchVersions()
  }, [id, msgApi])

  return (
    <Tabs
      type="card"
      items={tabs}
      onChange={(e) => setCurrentTab(e as TabsKeys)}
    />
  )
}

export default Stretcher
