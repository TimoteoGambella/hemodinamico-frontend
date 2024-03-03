import { Empty, Flex, Space, Spin, Tag, Typography } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import useStretchers from '../../hooks/useStretchers'
import FormFloatButton from '../FloatButton'
import useMsgApi from '../../hooks/useMsgApi'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CustomForm from '../Form'
import './style.css'

const Stretcher = () => {
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
  const [formProp, setFormProp] = useState<FormPropType>({
    shouldSubmit: false,
    enable: false,
    status: 'ok',
    message: '',
  })

  const handleEdit = () =>
    setFormProp({ ...formProp, enable: !formProp.enable })

  return (
    <>
      <Flex className="header-content">
        <Typography.Title level={2} className="header-title">
          {stretcherData.label ?? stretcherData._id}
        </Typography.Title>
        <Flex>
          {stretcherData.aid?.map((type) => (
            <Tag color={type === 'ecmo' ? 'blue' : 'red'} key={type}>
              {type.toUpperCase()}
            </Tag>
          ))}
        </Flex>
      </Flex>
      <FormFloatButton onEditClick={handleEdit} />
      <Flex justify="center" gap={10} wrap="wrap">
        <Space className="form-space-content">
          <CustomForm.Stretchers formProp={formProp} data={stretcherData} />
        </Space>
      </Flex>
    </>
  )
}

export default Stretcher
