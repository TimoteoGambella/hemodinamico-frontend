import { createContext, useEffect, useState } from 'react'

const isMobileView = window.document.body.clientWidth <= 768

interface CollapseContextProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export const CollapseContext = createContext<CollapseContextProps>({
  isCollapsed: isMobileView,
  setIsCollapsed: () => {},
})

export const CollapseProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(isMobileView)
  useEffect(() => {
    const handleResize = () => {
      if (!isCollapsed && window.document.body.clientWidth <= 768)
      setIsCollapsed(true)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isCollapsed])

  return (
    <CollapseContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </CollapseContext.Provider>
  )
}
