import * as React from 'react';
import { NamedProps, QueryProps, graphql, ChildDataProps, ChildProps, DataValue, MutationFunc } from 'react-apollo';
import gql from 'graphql-tag';



const historyMutation = gql`
  mutation updateHistory($input: updateHistoryMutation) {
    updateHistory(input: $input) {
      solutionId
      delta
    }
  }
`;


interface Mutation {
    update: MutationFunc<MutationPayload, MutationInput>;
}

interface MutationPayload {
    updateHistory: Record<any, any>[];
}

interface MutationInput {
    input: InputType;
}

interface InputType {
    id: string;
    newDelta: string;
}
interface Props {
    solutionId: string;
}


namespace UpdateHistoryView {

    interface ComponentProps {

    }

    interface OwnProps {

    }


}

// mutation with name
class UpdateHistoryView extends React.Component<ChildProps<Mutation, MutationPayload>,
    {}
    > {
    public updateHistory() {
        this.props.update({
            variables: {
                input: {
                    id: 'historyId',
                    newDelta: 'newDelta',
                },
            },
        });
    }

    public render() {
        return null;
    }
}


const withUpdateHistory = graphql<MutationInput,
    MutationPayload,
    MutationInput,
    ChildProps<Mutation, MutationPayload>>(historyMutation, {
        props: ({ mutate }) => ({
            update: ({ variables }) => mutate({ variables }),
        }),
    });








