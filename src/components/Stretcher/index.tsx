import StretcherSummary from './components/StretcherSummary'
import StretcherContent from './components/StretcherContent'
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
  const [isLoading, setIsLoading] = useState(true)
  const stretcherData = useStretchers()?.find(
    (stretcher) => stretcher._id === id
  ) as PopulatedStretcher
  const [versions, setVersions] = useState<PopulatedStretcher[] | null>(null)

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
        <StretcherSummary stretcher={versions} />
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
        msgApi.error((res.response?.data as { message: string })?.message || 'Error al obtener versiones')
        return
      }
      const versions = (res.data.data as PopulatedStretcher[]).filter((stretcher) => stretcher.patientId !== null)
      setVersions(versions)
    }
    fetchVersions()
  }, [id, msgApi])

  return <Tabs type="card" items={tabs} />
}

export default Stretcher
