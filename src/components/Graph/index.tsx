import LinealGraph from "./items/LinealGraph"
import Bar from "./items/BarGraph"
import './style.css'

export default function Graphs(children: React.ReactNode) {
  return <>{children}</>
}

Graphs.Bar = Bar
Graphs.Line = LinealGraph
