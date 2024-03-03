import { CollapseContext } from "../contexts/CollapseProvider"
import { useContext } from "react"

const useCollapsed = () => useContext(CollapseContext).isCollapsed

export default useCollapsed
