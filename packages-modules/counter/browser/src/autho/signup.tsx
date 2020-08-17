import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Form, Input, Button, Checkbox, Row, Col, Divider  } from 'antd';
import auth from '../auth/initAuth';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

const style = { background: "#fff", padding: "20px"}

const RegistrationForm: React.FC = () => {

  const [email, setEmail] = useState('');   
  const [password , setPassword] = useState('');
  
  const { loginWithRedirect } = useAuth0();
  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  const handleSubmit = (event:any, data:any) => {
    event.preventDefault();
    auth.signup(email,password);
  }

  // const loginWithGoogle = (e:any) => {
  //   e.preventDefault();
  //   auth.loginWithGoogle();
  // }

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
        <h2 style={{textAlign: "center"}}>Signup</h2>
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
          <Button type="primary" htmlType="submit" className="login-form-button" style={{width: "100%"}} >
            Sign Up
          </Button>
          <span style={{ textAlign: "center", display: "block" }}>OR</span>

          <Button type="primary" htmlType="submit" onClick={() => loginWithRedirect()} className="login-form-button" style={{width: "100%"}} >
            Continue with Google
          </Button>
        </Form.Item>
      </Form>
        </Col>
      </Row>

  );
};

export default RegistrationForm;