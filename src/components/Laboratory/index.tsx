import { useNavigate, useParams } from 'react-router-dom'
import LabSummary from './components/LabSummary'
import LabContent from './components/LabContent'
import LabTrends from './components/LabTrends'
import useMsgApi from '../../hooks/useMsgApi'
import { getLabVersions } from './controller'
import { useEffect, useState } from 'react'
import useLabs from '../../hooks/useLabs'
import { Empty, Spin, Tabs } from 'antd'
import { AxiosError } from 'axios'
import './style.css'

const Laboratory = () => {
  const labs = useLabs()
  const { id } = useParams()
  const msgApi = useMsgApi()
  const navigateTo = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<LaboratoryData | null>(null)
  const [currentTab, setCurrentTab] = useState<TabsKeys>('general-info')
  const [versions, setVersions] = useState<LaboratoryData[] | null>(null)
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
      children: <LabSummary versions={versions} currentTab={currentTab} />,
    },
    {
      label: 'Gráficos y tendencias',
      key: 'graphs-trends',
      children: <LabTrends versions={versions} currentTab={currentTab} />,
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

  useEffect(() => {
    if (!id) return
    const fetchApi = async () => {
      const res = await getLabVersions(id)
      if (res instanceof AxiosError) {
        msgApi.error(res.message)
        return
      } else {
        const val = (res.data.data as LaboratoryData[])
          .filter((lab) => lab.__v !== 0)
          .sort((a, b) => b.__v - a.__v)
        setVersions(val)
      }
    }
    fetchApi()
  }, [setVersions, id, msgApi])

  return (
    <Tabs
      type="card"
      items={tabs}
      onChange={(e) => setCurrentTab(e as TabsKeys)}
    />
  )
}

export default Laboratory
