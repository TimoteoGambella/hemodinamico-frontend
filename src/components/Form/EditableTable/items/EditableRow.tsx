import { Form, FormInstance } from "antd"
import { createContext } from "react"

export interface Item {
  name: string
  dose: 0
  units: string
}

export const EditableContext = createContext<FormInstance<Item> | null>(null)

interface EditableRowProps {
  index: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

export default EditableRow
