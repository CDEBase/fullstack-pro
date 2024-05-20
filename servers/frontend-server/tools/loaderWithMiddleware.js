
const isDevelopment = process.env.NODE_ENV === 'development';

// This will be your main loader function in Remix or similar environments
export async function loaderWithMiddleware(params, middlewareStack) {
  console.log('--MIDDLEWARES', middlewareStack);
  const loaderData = {};
  // Function to execute middleware recursively with logging
  const executeMiddlewares = async (index) => {
    if (index < middlewareStack.length) {
      const middleware = middlewareStack[index];
      const start = process.hrtime(); // Get start time
      if (isDevelopment) {
        console.log(`[[Middleware ${middleware.name}]] starts to run`); // Log time taken
      }
      await middleware.func(params, loaderData, async () => await executeMiddlewares(index + 1));
      const end = process.hrtime(start); // Get end time
      const elapsedTime = (end[0] * 1e9 + end[1]) / 1e6; // Convert to milliseconds
      if (isDevelopment) {
        console.log(`[[Middleware ${middleware.name}]] took ${elapsedTime} ms`); // Log time taken
      }
    }
  };

  await executeMiddlewares(0);  // Start middleware execution from the first one
  return loaderData;
}