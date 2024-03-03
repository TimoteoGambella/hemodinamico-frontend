import { MessageInstance } from "antd/es/message/interface"
import { Flex, Typography, Tag, Space } from "antd"
import FloatBtn from "../FloatBtn"
import { useState } from "react"
import CustomForm from "../Form"

interface MainContentProps {
  msgApi: MessageInstance
  stretcherData: StretcherData
}

const StretcherContent = ({ stretcherData }: MainContentProps) => {
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
      <FloatBtn.Options onEditClick={handleEdit} />
      <FloatBtn.ToTop />
      <Flex justify="center" gap={10} wrap="wrap">
        <Space className="form-space-content">
          <CustomForm.Stretchers formProp={formProp} data={stretcherData} />
        </Space>
      </Flex>
    </>
  )
}

export default StretcherContent
