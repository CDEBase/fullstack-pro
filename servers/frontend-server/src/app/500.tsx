import * as React from 'react';
import { Result, Button } from 'antd';

export const Error500 = ({ title, status, data }: any) => {
  return (
    <Result
      title={title}
      status={status}
      subTitle={`Sorry, the server is wrong. Error: ${data}`}
      extra={<Button href={process.env.CLIENT_URL} type="primary">Back Home</Button>}
    />
  );
}
