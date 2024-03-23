import { initials, miniavs } from '@dicebear/collection'
import { Typography, List, Avatar, Space } from 'antd'
import { createAvatar } from '@dicebear/core'
import { useEffect, useState } from 'react'

interface ListNewsProps {
  source: PopulatedPatient[] | PopulatedStretcher[] | PopulatedLab[] | null
  type: 'patients' | 'stretchers' | 'labs'
  header: string
}

export default function ListNews({ source, type, header }: ListNewsProps) {
  const [data, setData] = useState<ListNewsProps['source']>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (source) {
      const copy = JSON.parse(JSON.stringify(source)) as PopulatedPatient[]
      copy.sort(
        (a, b) => {
          if (a.editedAt && b.editedAt) {
            return b.editedAt - a.editedAt
          } else {
            return b.createdAt - a.createdAt
          }
        }
      )
      setData(copy)
      setIsLoading(false)
    }
  }, [source])

  return (
    <div className="listNews-container">
      <Typography.Title level={4} className="listNews-header">
        {header}
      </Typography.Title>

      <List
        loading={isLoading}
        dataSource={(data as unknown[]) ?? []}
        className="listNews-content"
        renderItem={(item) => {
          if (type === 'patients')
            return (
              <PopulatedPatient
                key={(item as PopulatedPatient)._id}
                item={item as PopulatedPatient}
              />
            )
          else if (type === 'stretchers')
            return (
              <PopulatedStretchers
                key={(item as PopulatedStretcher)._id}
                item={item as PopulatedStretcher}
              />
            )
          else
            return (
              <PopulatedLaboratory
                key={(item as PopulatedLab)._id}
                item={item as PopulatedLab}
              />
            )
        }}
      />
    </div>
  )
}

function PopulatedLaboratory({ item }: { item: PopulatedLab }) {
  const avatar = createAvatar(initials, {
    seed: item.patientId?.fullname,
  })

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={avatar.toDataUriSync()} />}
        title={<a>Laboratorio asignado a {item.patientId?.fullname}</a>}
        description={
          <Space direction="vertical" style={{ gap: 0 }}>
            <span>
              Paciente asignado:{' '}
              {item.patientId ? item.patientId?.fullname : 'Disponible'}
            </span>
            <span>
              Editado por: {item.editedBy ? item.editedBy.name : 'Desconocido'}
            </span>
            <span>
              Fecha de edición:{' '}
              {new Date(item.editedAt ?? item.createdAt).toLocaleDateString()}
            </span>
          </Space>
        }
      />
    </List.Item>
  )
}

function PopulatedStretchers({ item }: { item: PopulatedStretcher }) {
  const avatar = createAvatar(initials, {
    seed: item.label!,
  })

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={avatar.toDataUriSync()} />}
        title={<a>{item.label}</a>}
        description={
          <Space direction="vertical" style={{ gap: 0 }}>
            <span>
              Paciente asignado:{' '}
              {item.patientId ? item.patientId?.fullname : 'Disponible'}
            </span>
            <span>
              Editado por: {item.editedBy ? item.editedBy.name : 'Desconocido'}
            </span>
            <span>
              Fecha de edición:{' '}
              {new Date(item.editedAt ?? item.createdAt).toLocaleDateString()}
            </span>
          </Space>
        }
      />
    </List.Item>
  )
}

function PopulatedPatient({ item }: { item: PopulatedPatient }) {
  const hair: miniavs.Options['hair'] = ['classic01']

  if (item.gender === 'F') hair[0] = 'long'

  const avatar = createAvatar(miniavs, {
    seed: item.fullname.split(' ')[0],
    mouth: ['default'],
    hair,
  })

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={avatar.toDataUriSync()} />}
        title={<a>{item.fullname}</a>}
        description={
          <Space direction="vertical" style={{ gap: 0 }}>
            <span>DNI: {item.dni}</span>
            <span>
              Editado por: {item.editedBy ? item.editedBy.name : 'Desconocido'}
            </span>
            <span>
              Fecha de edición:{' '}
              {new Date(item.editedAt ?? item.createdAt).toLocaleDateString()}
            </span>
          </Space>
        }
      />
    </List.Item>
  )
}
