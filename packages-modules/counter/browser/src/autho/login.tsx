import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Form, Input, Button, Checkbox, Row, Col, Divider  } from 'antd';
import auth from '../auth/initAuth';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

const style = { background: "#fff", padding: "20px"}

const LoginForm: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password , setPassword] = useState('');
  // const [isButtonDisable, setIsButtonDisable] = useState(true);
  // const [isRemember, setIsRemember] = useState('');
  
  const { loginWithRedirect } = useAuth0();
  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();
    auth.login(email,password);
  }

  return (
    <Row style={{marginTop: "50px"}}>
    <Col span={12} offset={6}>
        <Form
        onSubmit={handleSubmit}
        name="normal_login"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        style={style}
      >
        <h2 style={{textAlign: "center"}}>Login</h2>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input your Email!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value
            )}
          />  
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            value={password}
            placeholder="Password"
            onChange={ e => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a  href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{width: "100%"}} >
            Log in
          </Button>
          <span style={{ textAlign: "center", display: "block" }}>OR</span>

          <Button type="primary" htmlType="submit" onClick={() => loginWithRedirect()} className="login-form-button" style={{width: "100%"}} >
            Continue with Google
          </Button>
          DOn't have an account? <a href="">register now!</a>
        </Form.Item>
      </Form>
        </Col>
      </Row>

  );
};

export default LoginForm;