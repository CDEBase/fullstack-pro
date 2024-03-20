import { Outlet } from '@remix-run/react';

export default function Demo() {
  return (
    <div>
      <h2>Vite + Remix Demo</h2>
      <Outlet />
    </div>
  )
}