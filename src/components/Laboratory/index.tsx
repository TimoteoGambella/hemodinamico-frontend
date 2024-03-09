import { useNavigate, useParams } from 'react-router-dom'
import useCollapsed from '../../hooks/useCollapsed'
import LabSummary from './components/LabSummary'
import LabContent from './components/LabContent'
import useMsgApi from '../../hooks/useMsgApi'
import { useEffect, useState } from 'react'
import useLabs from '../../hooks/useLabs'
import { Empty, Spin, Tabs } from 'antd'
import './style.css'

type TabsKeys = 'general-info' | 'summary' | 'graphs-trends'

const Laboratory = () => {
  const labs = useLabs()
  const { id } = useParams()
  const msgApi = useMsgApi()
  const isCollapsed = useCollapsed()
  const navigateTo = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<LaboratoryData | null>(null)
  const [currentTab, setCurrentTab] = useState<TabsKeys>('general-info')
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
      children: <LabSummary id={id as string} />,
    },
    {
      label: 'Gráficos y tendencias',
      key: 'graphs-trends',
      children: <Empty description="Sin datos" />,
    },
  ]

  useEffect(() => {
    const main = document.querySelector('main')!
    if (currentTab === 'summary') {
      main.classList.add(...['transition-w-ease-out', 'min-w-680'])
      main.style.width = `calc(100dvw - ${isCollapsed ? 80 : 200}px)`
    } else {
      main.classList.remove(...['transition-w-ease-out', 'min-w-680'])
      main.style.width = ''
    }
  }, [currentTab, isCollapsed])

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

  return (
    <Tabs
      type="card"
      items={tabs}
      onChange={(e) => setCurrentTab(e as TabsKeys)}
    />
  )
}

export default Laboratory
