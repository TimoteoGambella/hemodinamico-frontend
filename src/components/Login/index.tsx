import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { MessageInstance } from 'antd/es/message/interface'
import { handleSubmit } from './controller'
import { useState } from 'react'
import './style.css'

interface LoginProps {
  msgApi: MessageInstance
}

const Login = ({ msgApi }: LoginProps): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Row className="main-login">
      <Col flex={3} className="hero" />
      <Col flex={2} className="login">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit({ setIsLoading, msgApi })}
        >
          <Typography.Title level={2}>Iniciar Sesión</Typography.Title>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese un usuario válido',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese una contraseña válida',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default Login
