import { Typography } from 'antd'
import { YAxis, CartesianGrid, Tooltip, Legend, LineChart } from 'recharts'

interface BarProps {
  title?: string
  data: unknown[]
  currentTab: string
  children: React.ReactNode
}

export default function LinealGraph({
  data,
  currentTab,
  children,
  title,
}: BarProps) {
  if (currentTab !== 'graphs-trends') return null

  return (
    <div>
      {title && <Typography.Title level={4}>{title}</Typography.Title>}

      <LineChart
        width={500}
        height={290}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis />
        <Tooltip />
        <Legend />
        {children}
      </LineChart>
    </div>
  )
}
