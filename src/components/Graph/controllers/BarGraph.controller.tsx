import { Cascader, MenuProps } from 'antd'

export function initializeMargin(margin: GraphsProps['margin']) {
  const defaultMargin = {
    top: 20,
    right: 5,
    left: 5,
    bottom: 5,
  }
  if (margin instanceof Function) return margin(defaultMargin)
  else return margin || defaultMargin
}

export function generateMenuItems(data: object, setter: (_: string[]) => void) {
  const options: CascaderOption[] = Object.entries(data).map((val) => ({
    value: val[0],
    label: val[0],
  }))
  options.unshift({ value: 'none', label: 'Ninguno' })

  return [
    {
      key: '1',
      label: (
        <Cascader.Panel
          options={options}
          onChange={(e: unknown) => setter(e as string[])}
          defaultValue={['none']}
          expandTrigger="hover"
        />
      ),
    },
  ] as MenuProps['items']
}

export const calcTrendLine = (
  data: GraphsProps['data'] | null[],
  key: string,
  origin: number
) => {
  const newData = data.filter((d) => d !== null) as GraphsProps['data']
  const calculatedTrend = newData.map((d) => d[key])
  const slope =
    (calculatedTrend[calculatedTrend.length - 1] - calculatedTrend[0]) /
    (calculatedTrend.length - 1)
  const intercept = calculatedTrend[0] - slope * calculatedTrend[0]

  let rest = 0

  const trendLineData = calculatedTrend.map((_, i) => {
    if (i === 0) rest = slope * i + 1 + intercept - origin
    return {
      trend: Number((slope * i + 1 + intercept - rest).toFixed(2)),
    }
  })

  return trendLineData
}

export const getMinAndMax = (data: GraphsProps['data']) => {
  const r_val = data.map((d) => {
    if (!d) return
    const keys = Object.keys(d)
    return {
      max: Math.max(...keys.map((k) => d[k])),
      min: Math.min(...keys.map((k) => d[k])),
    }
  })
  const val = r_val.filter((v) => v !== undefined) as { max: number; min: number }[]
  const min = Math.min(...val.map((v) => v.min))
  return {
    max: Math.floor(Math.max(...val.map((v) => v.max)) * 1.2),
    min: min < 0 ? min * 1.2 : 0,
  }
}
