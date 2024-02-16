import { MessageInstance } from 'antd/es/message/interface'
import { Empty, Flex, Space, Spin, Typography } from 'antd'
import { loadLabData } from './controller'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './style.css'

interface LaboratoryProps {
  msgApi: MessageInstance
}

const Laboratory = ({ msgApi }: LaboratoryProps) => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)
  const [labData, setLabData] = useState<LaboratoryData | null>(null)

  useEffect(() => {
    if (!id) return
    loadLabData({ id, msgApi })
      .then((res) => {
        console.log(res)
        setLabData(res)
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
      {shouldRender && labData ? (
        <MainContent labInfo={labData} msgApi={msgApi} />
      ) : (
        <Empty />
      )}
    </Spin>
  )
}

interface MainContentProps {
  msgApi: MessageInstance
  labInfo: LaboratoryData
}

const MainContent = ({ labInfo }: MainContentProps) => {
  const { patientId: patientInfo } = labInfo
  if (typeof patientInfo === 'string') return <Empty />
  return (
    <>
      <Typography.Title level={2}>EXÁMEN DE LABORATORIO</Typography.Title>
      <Flex>
        <Space
          style={{
            flexDirection: 'column',
            backgroundColor: 'yellow',
            border: '1px solid black',
            padding: '5px',
          }}
        >
          <Typography.Text strong>NOMBRES Y APELLIDOS</Typography.Text>
          <Typography.Text strong>DNI</Typography.Text>
        </Space>
        <Space
          style={{
            flexDirection: 'column',
            border: '1px solid black',
            padding: '5px',
          }}
        >
          <Typography.Text strong>{patientInfo?.fullname}</Typography.Text>
          <Typography.Text strong>{patientInfo?.dni}</Typography.Text>
        </Space>
      </Flex>
    </>
  )
}

export default Laboratory
