import { Button, Dropdown, MenuProps, Typography } from 'antd'
import * as ctrl from '../controllers/BarGraph.controller'
import { StockOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import * as Chart from 'recharts'

export default function LinealGraph(props: GraphsProps) {
  const { data, currentTab, children, title, yAxis, yAxisKey } = props
  const [selectedItem, setSelectedItem] = useState<string[]>(['none'])
  const [trendData, setTrendData] = useState<{ trend: number }[]>([])
  const [items, setItems] = useState<MenuProps['items']>([])
  const defaultMargin = ctrl.initializeMargin(props.margin)
  const [isOpen, setIsOpen] = useState(false)
  const [max, setMax] = useState<number>(0)
  const [min, setMin] = useState<number>(0)
  const defaultHeight = props.height || 350
  const defaultWidth = props.width || 556

  useEffect(() => {
    setIsOpen(false)
  }, [selectedItem])

  useEffect(() => {
    if (selectedItem[0] === 'none') return
    setTrendData(
      ctrl.calcTrendLine(data, selectedItem[0], data[0][selectedItem[0]])
    )
  }, [selectedItem, data])

  useEffect(() => {
    if (!data[0]) return
    setItems(ctrl.generateMenuItems(data[0], setSelectedItem))
  }, [data])

  useEffect(() => {
    if (!data[0]) return
    const res = ctrl.getMinAndMax(data)
    setMax(res.max)
    setMin(res.min)
  }, [data])

  if (yAxis && !yAxisKey)
    throw new Error('yAxisKey is required when yAxis is set')
  if (currentTab !== 'graphs-trends') return null

  return (
    <div className="Graph p-relative">
      {title && <Typography.Title level={4}>{title}</Typography.Title>}

      {(items && items.length > 0) && (
        <Dropdown menu={{ items }} placement="bottomLeft" open={isOpen} arrow>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            onBlur={() => setIsOpen(false)}
            className="trendButton"
            type="primary"
            size="small"
          >
            <StockOutlined />
          </Button>
        </Dropdown>
      )}

      <Chart.LineChart
        width={defaultWidth}
        height={defaultHeight}
        margin={defaultMargin}
        data={data}
      >
        <Chart.CartesianGrid strokeDasharray="3 3" />
        <Chart.YAxis domain={[min, max]} />
        {yAxis}
        <Chart.Tooltip />
        <Chart.Legend />
        {children}
        {selectedItem[0] !== 'none' && (
          <Chart.Line
            dot={false}
            stroke="red"
            type="linear"
            yAxisId={
              yAxis && selectedItem[0] === yAxisKey![0]
                ? yAxisKey![1]
                : undefined
            }
            dataKey="trend"
            name="Tendencia"
            data={trendData}
            strokeDasharray="3 3"
          />
        )}
      </Chart.LineChart>
    </div>
  )
}
