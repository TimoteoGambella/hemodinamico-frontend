import { UserDataContext } from "../../../contexts/UserDataProvider"
import DeleteBtn from "../../Form/EditableTable/items/DeleteBtn"
import useMsgApi from "../../../hooks/useMsgApi"
import { handleUserDelete } from "."
import { useContext } from "react"
import { Space } from "antd"

const DeleteAction = ({ record }: { record: UserData }) => {
  const updateUsers = useContext(UserDataContext).updateUsers
  const msgApi = useMsgApi()

  const handleClick = async (username: React.Key) => {
    const res = await handleUserDelete(username as string, msgApi)
    if (res) {
      updateUsers()
    }
  }

  return (
    <Space size="middle">
      <DeleteBtn
        record={{ key: record.username }}
        handleDelete={handleClick}
        dataSource={new Array(1).fill(null)}
      />
    </Space>
  )
}

export default DeleteAction
