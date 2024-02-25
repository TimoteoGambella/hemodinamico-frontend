import { TableProps } from 'antd'
import { AxiosError } from 'axios'
import ActionRender from './ActionRender'
import AxiosController from '../../../utils/axios.controller'
import { MessageInstance } from 'antd/es/message/interface'

const axios = new AxiosController()

interface GetColumnsProps {
  setShouldGetUsers: React.Dispatch<React.SetStateAction<boolean>>
}

export function getColumns({ setShouldGetUsers }: GetColumnsProps): TableProps<PatientData>['columns'] {
  return [
    {
      title: 'DNI',
      dataIndex: 'dni',
      key: 'dni',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Nombre completo',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Sexo',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => (text === 'M' ? 'Masculino' : 'Femenino'),
    },
    {
      title: 'Edad',
      key: 'age',
      dataIndex: 'age',
    },
    {
      title: 'Talla',
      key: 'height',
      dataIndex: 'height',
      render: (text) => text + ' cm',
    },
    {
      title: 'Peso',
      key: 'weight',
      dataIndex: 'weight',
      render: (text) => text + ' kg',
    },
    {
      title: 'Acciones',
      key: 'action',
      width: 265,
      render: (_, data) => {
        return (
          <ActionRender data={data._id} setShouldGetUsers={setShouldGetUsers} />
        )
      },
    },
  ]
}

interface HandleAssignLabProps {
  patient: PatientData | undefined
  updateLabs: () => Promise<void>
  updatePatients: () => Promise<void>
  msgApi: MessageInstance
}

export async function handleAssignLab({ patient, updateLabs, updatePatients, msgApi }: HandleAssignLabProps) {
  if(!patient) return
  const body = { patientId: patient._id }
  msgApi.open({
    type: 'loading',
    content: 'Asignando laboratorio...',
    duration: 0
  })
  const res = await axios.createLab(body)
  msgApi.destroy()
  if (res instanceof AxiosError) {
    msgApi.error('Error al asignar laboratorio. Inténtelo de nuevo más tarde.')
    return
  }
  msgApi.success('Laboratorio asignado con éxito.')
  msgApi.open({
    type: 'loading',
    content: 'Actualizando repositorio...',
    duration: 0
  })
  await Promise.all([updateLabs(), updatePatients()]).finally(() => msgApi.destroy())
}
