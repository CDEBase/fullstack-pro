import * as React from 'react';
import { Error500 } from './500';
import {
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

export function ErrorBoundary() {
  const error = useRouteError();

  React.useEffect(() => {
    console.trace(error);
  }, [error]);

  if (isRouteErrorResponse(error)) {
    return (
      <Error500 title={error.statusText} status={error.status} data={error.data} />
    );
  } else if (error instanceof Error) {
    return (
      <Error500 title={error.message} status="500" data={error.stack} />
    );
  } else {
    return (
      <Error500 title="Unknown Error" status="500" data={error} />
    );
  }
}
