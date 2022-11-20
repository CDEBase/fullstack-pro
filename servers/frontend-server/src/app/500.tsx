import { Button,Result } from 'antd';
import * as React from 'react';

export const Error500 = ({ error }: any) => {
	React.useEffect(() => {
		console.trace(error);
	}, [error]);

	return (
		<Result
			title='500'
			status='500'
			subTitle={`Sorry, the server is wrong. Error: ${error}`}
			extra={
				<Button href={process.env.CLIENT_URL} type='primary'>
					Back Home
				</Button>
			}
		/>
	);
};
