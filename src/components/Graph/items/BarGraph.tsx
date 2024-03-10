import { Typography } from 'antd'
import { BarChart, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

type MarginProps = {
  top?: number
  right?: number
  left?: number
  bottom?: number
}

interface BarProps {
  title?: string
  width?: number
  height?: number
  margin?: MarginProps | ((props: MarginProps) => MarginProps)
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
  width,
  height,
  margin,
}: BarProps) {
  const defaultWidth = width || 556
  const defaultHeight = height || 350
  const defaultMargin = initializeMargin(margin)

  if (currentTab !== 'graphs-trends') return null

  return (
    <div>
      {title && <Typography.Title level={4}>{title}</Typography.Title>}

      <BarChart
        data={data}
        width={defaultWidth}
        height={defaultHeight}
        margin={defaultMargin}
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

function initializeMargin(margin: BarProps["margin"]) {
  const defaultMargin = {
    top: 20,
    right: 5,
    left: 5,
    bottom: 5,
  }
  if (margin instanceof Function) return margin(defaultMargin)
  else return margin || defaultMargin
}
