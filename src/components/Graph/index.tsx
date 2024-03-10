import Bar from "./items/BarGraph"
import LinealGraph from "./items/LinealGraph"

export default function Graphs(children: React.ReactNode) {
  return <>{children}</>
}

Graphs.Bar = Bar
Graphs.Line = LinealGraph
