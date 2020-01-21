import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useAddCounter_WsMutation } from '../generated-model';


const CounterView = ({
  loading,
  counter,
  addCounter,
  reduxCount,
  onReduxIncrement,
  counterState,
  addCounterState,
}: any) => {

  const [ addCounterWs ] = useAddCounter_WsMutation();
  const renderMetaData = () => (
    <Helmet>
      <title>Counter</title>
      <meta name="description" content="Counter example page" />
    </Helmet>
  );

  if (loading) {
    return (
      <div>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </div>
    );
  } else {
    return (
      <div>
        {renderMetaData()}
        <section>
          <p>
            Current counter, is {counter.amount}. This is being stored
            server-side in the database and using Apollo subscription for
            real-time updates.
          </p>
          <button id="graphql-button" color="primary" onClick={addCounter(1)}>
            Click to increase counter
          </button>
          <button id="graphql-button" color="primary" onClick={() => addCounterWs({variables: { amount: 1 }})}>
            Click to increase counter via websocket
          </button>
        </section>
        <section>
          <p>
            Current reduxCount, is {reduxCount}. This is being stored
            client-side with Redux.
          </p>
          <button
            id="redux-button"
            color="primary"
            onClick={onReduxIncrement(1)}
          >
            Click to increase reduxCount
          </button>
        </section>
        <section>
          <p>
            Current apolloLinkStateCount, is {counterState}. This is being
            stored client-side with Apollo Link State.
          </p>
          <button
            id="apollo-link-button"
            color="primary"
            onClick={addCounterState(1)}
          >
            Click to increase apolloLinkState
          </button>
        </section>
      </div>
    );
  }
};

export default CounterView;
