import { Link, Outlet } from '@remix-run/react';
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Fullstack Pro" },
    { name: "description", content: "Welcome to Fullstack Pro!" },
  ];
};

export default function Index() {
  // return OuterModule();
  return (
    <div style={{ 
      fontFamily: "system-ui, sans-serif", 
      lineHeight: "1.8",
      display: "flex", 
    }}>
      <aside style={{ flexGrow: 1 }}>
        <ul>
          <li><Link to={'/'}>Home</Link></li>
          <li><Link to={'/demo'}>Demo</Link></li>
          <li><Link to={'/demo/counter'}>Demo/Counter</Link></li>
          <li><Link to={'/demo/counter/10'}>Demo/Counter with param 10</Link></li>
          <li><Link to={'/codegen'}>Outer modules with codegen</Link></li>
        </ul>
      </aside>
      <section style={{ flexGrow: 2 }}>
        <h1>Welcome to Remix</h1>
        <Outlet />
      </section>
    </div>
  );
}
