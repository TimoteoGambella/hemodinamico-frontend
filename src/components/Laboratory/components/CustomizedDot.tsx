import { DotProps } from "recharts"

const CustomizedDot = (props: DotProps & { value?: number }) => {
  const { cx, cy, value, stroke } = props

  if (!cx || !cy || !value) throw new Error('cx, cy or value are not defined')

  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="green" viewBox="0 0 24 24">
      <circle cx={12} cy={12} r={12} fill="white" stroke={stroke} strokeWidth="1" />
      <text x={11.5} y={13.5} textAnchor="middle" alignmentBaseline="middle" fill="black">{value}</text>
    </svg>
  )
}

export default CustomizedDot
