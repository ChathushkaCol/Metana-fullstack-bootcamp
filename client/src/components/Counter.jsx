import { useState } from 'react';

export default function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);

  return (
    <div style={{ display:'grid', gap:'0.5rem', width:220 }}>
      <div role="status" aria-label="count" style={{ fontSize:24, textAlign:'center' }}>
        {count}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
        <button onClick={() => setCount(c => c + 1)}>Increment</button>
        <button onClick={() => setCount(c => Math.max(0, c - 1))}>Decrement</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
}
