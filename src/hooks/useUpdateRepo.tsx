import { LaboratoryDataContext } from '../contexts/LaboratoryDataProvider'
import { StretcherDataContext } from '../contexts/StretcherDataProvider'
import { PatientDataContext } from '../contexts/PatientDataProvider'
import { UserDataContext } from '../contexts/UserDataProvider'
import { useContext } from 'react'
import useMsgApi from './useMsgApi'
import { ArgsProps } from 'antd/es/message'

const useUpdateRepo = () => {
  const { updateStretchers } = useContext(StretcherDataContext)
  const { updatePatients } = useContext(PatientDataContext)
  const { updateLabs } = useContext(LaboratoryDataContext)
  const { updateUsers } = useContext(UserDataContext)
  const msgApi = useMsgApi()
  const msgBody: ArgsProps = {
    type: 'loading',
    content: 'Actualizando repositorios...',
    key: 'update-repos',
    duration: 0,
  }

  const updateAll = async (withMsg: boolean = true) => {
    if (withMsg) {
      msgApi.open(msgBody)
    }
    return Promise.all([
      updateLabs(),
      updateStretchers(),
      updatePatients(),
      updateUsers(),
    ])
      .then(() => {
        msgApi.destroy('update-repos')
        msgApi.success('Repositorio actualizado con éxito.')
      })
      .catch(() => msgApi.destroy('update-repos'))
  }

  return updateAll
}

export default useUpdateRepo
