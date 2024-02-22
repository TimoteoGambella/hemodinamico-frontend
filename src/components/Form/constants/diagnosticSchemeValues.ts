export default [
  {
    name: 'shock',
    label: 'Shock',
    subType: [
      {
        name: 'isquemico',
        label: 'Isquémico',
      },
      {
        name: 'no_isquemico',
        label: 'No Isquémico',
      },
    ],
  },
  {
    name: 'falla_cardiaca',
    label: 'Falla Cardíaca',
    subType: [
      {
        name: 'aguda',
        label: 'Aguda',
      },
      {
        name: 'cronica',
        label: 'Crónica',
      },
      {
        name: 'FCAD',
        label: 'F.C.A.D',
      },
    ],
    child: [
      {
        name: 'isquemia',
        label: 'Isquemica',
      },
      {
        name: 'no_isquemica',
        label: 'No Isquemica',
      },
    ],
  },
  {
    name: 'infarto',
    label: 'Infarto',
    subType: [
      {
        name: 'st_no_elevado',
        label: 'ST no Elevado',
      },
      {
        name: 'st_elevado',
        label: 'ST Elevado',
      },
    ],
    child: [
      {
        name: 'anterior',
        label: 'Anterior',
      },
      {
        name: 'anterosepta',
        label: 'Anterosepta',
      },
      {
        name: 'inferior',
        label: 'Inferior',
      },
      {
        name: 'inf_post_la',
        label: 'INF/POST/LA',
      },
    ],
  },
  {
    name: 'valvular',
    label: 'Valvular',
    subType: [
      {
        name: 'aortico',
        label: 'Aórtico',
      },
      {
        name: 'mitral',
        label: 'Mitral',
      },
      {
        name: 'tricuspide',
        label: 'Tricúspide',
      },
    ],
    child: [
      {
        name: 'insuficiente',
        label: 'Insuficiente',
      },
      {
        name: 'estenosis',
        label: 'Estenosis',
      },
      {
        name: 'doble_lesion',
        label: 'Doble Lesión',
      },
    ],
  },
]
