import React from 'react';
import { Button, Card, Flex, Typography, Checkbox, Form, Input } from 'antd';

const cardStyle = {
  width: 500,
  padding: 20,
  borderRadius: 8,
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const LoginForm = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Flex 
      justify="center" 
      align="center" 
      style={{ minHeight: "100vh", background: "#f4f4f4" }}
    >
      <Card hoverable style={cardStyle}>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
        <h1>Login</h1> 
        </Typography.Title>

        <Form
          name="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="Email"
            className='input-field-padding'
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
                className='input-field-padding'
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginForm;
