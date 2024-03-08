import StretcherDrugs from './items/StretcherDrugs'
import InfectiveLab from './items/InfectiveLab'
import React from 'react'

const EditableTable = (child: React.ReactNode) => {
  return <>{child}</>
}

EditableTable.Stretcher = StretcherDrugs
EditableTable.Infective = InfectiveLab

export default EditableTable
