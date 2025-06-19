import React from 'react';

// Star 컴포넌트 추가
export function Circle({ position }) {
  return (
    <mesh position={position}>
      <circleGeometry args={[0.1, 100, 0]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
  );
}
