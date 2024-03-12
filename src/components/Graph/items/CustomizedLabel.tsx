interface CustomizedLabelProps {
  x?: number
  y?: number
  stroke?: string
  value?: number
}

export default function CustomizedLabel(props: CustomizedLabelProps) {
  const { x, y, stroke, value } = props

  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={12} textAnchor="middle">
      {value}
    </text>
  )
}
