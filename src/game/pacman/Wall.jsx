import React from 'react';

// Wall 컴포넌트 추가
export function Wall({ position, args }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshBasicMaterial color="gray" />
    </mesh>
  );
}
