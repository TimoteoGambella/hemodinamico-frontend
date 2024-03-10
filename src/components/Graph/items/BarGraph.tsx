import { Typography } from 'antd'
import { BarChart, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface BarProps {
  title?: string
  data: unknown[]
  currentTab: string
  yAxis?: React.ReactNode
  children: React.ReactNode
}

export default function BarGraph({
  currentTab,
  data,
  children,
  title,
  yAxis,
}: BarProps) {
  if (currentTab !== 'graphs-trends') return null

  return (
    <div>
      {title && <Typography.Title level={4}>{title}</Typography.Title>}

      <BarChart
        data={data}
        width={600}
        height={290}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis />
        {yAxis}
        <Tooltip />
        <Legend />
        {children}
      </BarChart>
    </div>
  )
}
