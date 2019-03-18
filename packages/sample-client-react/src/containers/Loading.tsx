import * as React from 'react';

interface Props {}

const Loading: React.SFC<Props> = () => (
    <div>Loading</div>
);

// export const displayLoadingState = branch(
//     props => props.data.loading,
//     renderComponent(Loading)
// );
