import { TableColumnsType } from "antd"

type SchemaType = StretcherData & { key: React.Key }

const SummarySchema: TableColumnsType<SchemaType> = [
  {
    title: "Fecha",
    dataIndex: "createdAt",
    key: "date",
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    title: "Hora",
    dataIndex: "createdAt",
    key: "time",
    render: (value) => new Date(value).toLocaleTimeString(),
  },
  {
    title: "Presión AD",
    dataIndex: ["cateter", "presion", "AD"],
    key: "rightPressure",
  }
]

export default SummarySchema
