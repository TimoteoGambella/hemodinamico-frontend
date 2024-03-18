/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchOutlined } from "@ant-design/icons"
import { TableColumnType, Input, Space, Button, InputRef } from "antd"
import { FilterDropdownProps } from "antd/es/table/interface"
import Highlighter from "react-highlight-words"

interface ColumnSearchGeneratorProps {
  searchTextRef: React.MutableRefObject<string>
  searchedColumnRef: React.MutableRefObject<string>
  searchInput: React.MutableRefObject<InputRef | null>
}

export default function columnSearchGenerator(props: ColumnSearchGeneratorProps)  {
  const { searchTextRef, searchedColumnRef, searchInput } = props
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string
  ) => {
    confirm()
    searchTextRef.current = selectedKeys[0]
    searchedColumnRef.current = dataIndex
  }
  
  const handleReset =(clearFilters: () => void) => {
    clearFilters()
    searchTextRef.current = ''
  }
  
  const getColumnSearchProps = (
    dataIndex: string
  ): TableColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((o, p) => (o || {})[p], obj)
      }
      return getNestedValue(record, dataIndex)
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
    searchedColumnRef.current === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchTextRef.current]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })
  return getColumnSearchProps
}
