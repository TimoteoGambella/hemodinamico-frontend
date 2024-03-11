import { Cascader, MenuProps } from 'antd'

export function initializeMargin(margin: BarGraphProps['margin']) {
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
  const options: CascaderOption[] = [
    {
      value: 'none',
      label: 'Ninguna',
    },
    {
      value: 'linear',
      label: 'Tendencia lineal',
      children: Object.entries(data).map((val) => ({
        value: val[0],
        label: val[0],
      })),
    },
    {
      value: 'exponential',
      label: 'Tendencia exponencial',
      children: Object.entries(data).map((val) => ({
        value: val[0],
        label: val[0],
      })),
    },
  ]

  return [
    {
      key: '1',
      label: (
        <Cascader.Panel
          options={options}
          onChange={(e: unknown) => setter(e as string[])}
          defaultValue={['none']}
        />
      ),
    },
  ] as MenuProps['items']
}
