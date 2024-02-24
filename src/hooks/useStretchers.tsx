import { useContext } from 'react'
import { StretcherDataContext } from '../contexts/StretcherDataProvider'

const useStretchers = () => useContext(StretcherDataContext).stretchers

export default useStretchers
