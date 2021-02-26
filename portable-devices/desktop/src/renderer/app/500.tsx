import * as React from 'react';

export const Error500 = ({ error }: any) => {
    React.useEffect(() => {
        console.trace(error);
    }, [error]);

    return (
        <div>ERROR</div>
    );
}