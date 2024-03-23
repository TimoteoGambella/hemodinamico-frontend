import useStretchers from '../../../hooks/useStretchers'
import { Flex, Typography, Tag, Space } from 'antd'
import { useEffect, useState } from 'react'
import FloatBtn from '../../FloatBtn'
import CustomForm from '../../Form'

interface MainContentProps {
  stretcherData: StretcherData | PopulatedStretcher
}

const StretcherContent = ({ stretcherData }: MainContentProps) => {
  const stretchers = useStretchers()
  const [key, setKey] = useState(Math.random())
  const [formProp, setFormProp] = useState<FormPropType>({
    shouldSubmit: false,
    enable: false,
    status: 'ok',
    message: '',
  })

  const handleEdit = () =>
    setFormProp({ ...formProp, enable: !formProp.enable })

  useEffect(() => {
    /**
     * Esto es para que el formulario se vuelva a renderizar
     */
    setKey(Math.random())
  }, [stretchers])

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
      <FloatBtn.Options onEditClick={handleEdit} deleteType="stretcher" />
      <FloatBtn.ToTop />
      <Flex justify="center" gap={10} wrap="wrap">
        <Space className="form-space-content">
          <CustomForm.Stretchers
            formProp={formProp}
            data={stretcherData}
            key={key}
          />
        </Space>
      </Flex>
    </>
  )
}

export default StretcherContent
