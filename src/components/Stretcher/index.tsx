import { MessageInstance } from 'antd/es/message/interface'
import { Empty, Flex, Space, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { loadStretcherData } from './controller'
import { useParams } from 'react-router-dom'
import useMsgApi from '../../hooks/useMsgApi'
import './style.css'

interface StretcherProps {}

// eslint-disable-next-line no-empty-pattern
const Stretcher = ({}: StretcherProps) => {
  const { id } = useParams()
  const msgApi = useMsgApi()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)
  const [stretcherData, setStretcherData] = useState<StretcherData | null>(null)

  useEffect(() => {
    if (!id) return
    loadStretcherData({ id, msgApi })
      .then((res) => {
        console.log(res)
        setStretcherData(res)
      })
      .catch((err) => {
        console.error(err)
        setShouldRender(false)
      })
      .finally(() => setIsLoading(false))
  }, [msgApi, id])

  useEffect(() => {
    setIsLoading(true)
    setShouldRender(true)
  }, [id])

  return (
    <Spin spinning={isLoading}>
      {shouldRender && stretcherData ? (
        <MainContent stretcherData={stretcherData} msgApi={msgApi} />
      ) : (
        <Empty />
      )}
    </Spin>
  )
}

interface MainContentProps {
  msgApi: MessageInstance
  stretcherData: StretcherData
}

const MainContent = ({ stretcherData }: MainContentProps) => {
  const { patientId: patientInfo } = stretcherData
  if (typeof patientInfo === 'string') return <Empty />
  return (
    <>
      <Typography.Title level={2}>
        {stretcherData.label ?? stretcherData._id}
      </Typography.Title>
      <Flex>
        <Space style={{ flexDirection: 'column', backgroundColor: 'yellow', border: '1px solid black', padding: '5px' }}>
          <Typography.Text strong>NOMBRES Y APELLIDOS</Typography.Text>
          <Typography.Text strong>DNI</Typography.Text>
        </Space>
        <Space style={{ flexDirection: 'column', border: '1px solid black', padding: '5px' }}>
          <Typography.Text strong>{patientInfo?.fullname}</Typography.Text>
          <Typography.Text strong>{patientInfo?.dni}</Typography.Text>
        </Space>
      </Flex>
    </>
  )
}

export default Stretcher
