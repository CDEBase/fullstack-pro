export const authWrapper = (Component: React.ReactElement, props: Record<string, any>) => {
  return <><h5>-- auth wrapped --</h5>{Component}</>;
}
