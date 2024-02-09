/// <reference types="vite/client" />

type FormLogin = {
  username: string
  password: string
}

type MenuItem = {
  key: React.Key
  label: React.ReactNode
  icon?: React.ReactNode
  children?: MenuItem[]
}
