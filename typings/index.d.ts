declare const __DEV__;
declare const __EXTERNAL_BACKEND_URL__;
declare const __PERSIST_GQL__;

interface AsyncIterator<T> {
  next(value?: any): Promise<IteratorResult<T>>;
  return?(value?: any): Promise<IteratorResult<T>>;
  throw?(e?: any): Promise<IteratorResult<T>>;
}