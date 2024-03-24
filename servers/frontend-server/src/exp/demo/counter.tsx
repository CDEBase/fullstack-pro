import { useParams } from '@remix-run/react';

export default function Counter() {
  const params = useParams();
  return (
    <div>
      <p>Count: {params?.num ?? 0}</p>
    </div>
  )
}