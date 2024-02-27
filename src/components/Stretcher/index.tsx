import { MessageInstance } from 'antd/es/message/interface'
import { Empty, Flex, Space, Spin, Tag, Typography } from 'antd'
import useStretchers from '../../hooks/useStretchers'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useMsgApi from '../../hooks/useMsgApi'
import CustomForm from '../Form'
import './style.css'

interface StretcherProps {}

// eslint-disable-next-line no-empty-pattern
const Stretcher = ({}: StretcherProps) => {
  const { id } = useParams()
  const msgApi = useMsgApi()
  const [isLoading, setIsLoading] = useState(true)
  const stretcherData = useStretchers()?.find(
    (stretcher) => stretcher._id === id
  )

  useEffect(() => {
    if (stretcherData) setIsLoading(false)
  }, [stretcherData])

  return (
    <Spin spinning={isLoading}>
      {stretcherData ? (
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
  const [formProp] = useState<FormPropType>({
    shouldSubmit: false,
    status: 'ok',
    message: '',
    enable: true,
  })

  useEffect(() => {}, [formProp])

  return (
    <>
      <Flex className="header-content">
        <Typography.Title level={2} className="header-title">
          {stretcherData.label ?? stretcherData._id}
        </Typography.Title>
        <Flex>
          {stretcherData.aid.types?.map((type) => (
            <Tag color={type === 'ecmo' ? 'blue' : 'red'} key={type}>
              {type.toUpperCase()}
            </Tag>
          ))}
        </Flex>
      </Flex>
      <Flex justify="center" gap={10} wrap="wrap">
        <Space className="form-space-content">
          <CustomForm.Stretchers formProp={formProp} data={stretcherData} />
        </Space>
      </Flex>
    </>
  )
}

export default Stretcher
