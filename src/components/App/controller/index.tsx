import { Menu } from "antd"
import { Link } from "react-router-dom"

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
) {
  return {
    key,
    icon,
    children,
    label,
  }
}

export function renderMenuItems(item: MenuItem): JSX.Element {
  if (item.children) {
    return (
      <Menu.SubMenu
        key={item.key}
        icon={item.icon}
        title={item.label}
      >
        {item.children.map((child) => (
          <Menu.Item key={child.key} icon={child.icon}>
            <Link to={`/${item.key}/${child.key}`}>
              {child.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    )
  } else {
    return (
      <Menu.Item key={item.key} icon={item.icon}>
        <Link to={`/${item.key}`}>{item.label}</Link>
      </Menu.Item>
    )
  }
}
