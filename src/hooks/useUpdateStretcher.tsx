import { useContext } from 'react'
import { StretcherDataContext } from '../contexts/StretcherDataProvider'

const useUpdateStretchers = () => useContext(StretcherDataContext).updateStretchers

export default useUpdateStretchers
