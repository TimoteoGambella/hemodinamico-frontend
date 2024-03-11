import { BarChart, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Button, Dropdown, MenuProps, Typography } from 'antd'
import * as ctrl from '../controllers/BarGraph.controller'
import { StockOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

export default function BarGraph({
  currentTab,
  data,
  children,
  title,
  yAxis,
  width,
  height,
  margin,
}: BarGraphProps) {
  const defaultWidth = width || 556
  const defaultHeight = height || 350
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<MenuProps['items']>([])
  const defaultMargin = ctrl.initializeMargin(margin)
  const [selectedItem, setSelectedItem] = useState<string[]>(['none'])

  useEffect(() => {
    setIsOpen(false)
  }, [selectedItem])

  useEffect(() => {
    if (data[0] === undefined) return
    setItems(ctrl.generateMenuItems(data[0] as object, setSelectedItem))
  }, [data])

  if (currentTab !== 'graphs-trends') return null

  return (
    <div className='Graph barGraph'>
      {title && <Typography.Title level={4}>{title}</Typography.Title>}

      <Dropdown menu={{ items }} placement="bottomLeft" open={isOpen} arrow>
        <Button
          type="primary"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setIsOpen(false)}
          size="small"
          className='trendButton'
        >
          <StockOutlined />
        </Button>
      </Dropdown>

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
