import { drugs } from "./suppliedDrugs"
import { category } from "./suppliedCategories"
import { units } from "./suppliedUnidades"

const capitalizar = (str: string) =>
  str.charAt(0).toUpperCase() + str.substring(1).toLocaleLowerCase()

export const suppliedSchema = [
  {
    value: category[0],
    label: capitalizar(category[0]) as (typeof category)[number],
    children: [
      {
        value: drugs[0].toUpperCase() as (typeof drugs)[number],
        label: capitalizar(drugs[0]) as (typeof drugs)[number],
        unidad: units[0],
      },
      {
        value: drugs[1].toUpperCase() as (typeof drugs)[number],
        label: capitalizar(drugs[1]) as (typeof drugs)[number],
        unidad: units[1],
      },
      {
        value: drugs[2].toUpperCase() as (typeof drugs)[number],
        label: capitalizar(drugs[2]) as (typeof drugs)[number],
        unidad: units[0],
      },
    ],
  },
  {
    value: category[1],
    label: capitalizar(category[1]) as (typeof category)[number],
    children: [
      {
        value: drugs[3].toUpperCase() as (typeof drugs)[number],
        label: capitalizar(drugs[3]) as (typeof drugs)[number],
        unidad: units[0],
      },
      {
        value: drugs[4].toUpperCase() as (typeof drugs)[number],
        label: capitalizar(drugs[4]) as (typeof drugs)[number],
        unidad: units[0],
      },
    ],
  },
  {
    value: category[2],
    label: capitalizar(category[2]) as (typeof category)[number],
    children: [
      {
        value: drugs[5].toUpperCase() as (typeof drugs)[number],
        label: capitalizar(drugs[5]) as (typeof drugs)[number],
        unidad: units[0],
      },
    ],
  },
  {
    value: category[3],
    label: capitalizar(category[3]) as (typeof category)[number],
    children: [
      {
        value: drugs[6].toUpperCase() as (typeof drugs)[number],
        label: capitalizar(drugs[6]) as (typeof drugs)[number],
        unidad: units[2],
      },
      {
        value: drugs[7].toUpperCase() as (typeof drugs)[number],
        label: capitalizar(drugs[7]) as (typeof drugs)[number],
        unidad: units[0],
      },
    ],
  },
]
