import { useLoader } from '@react-three/fiber';
import React from 'react';
import { TextureLoader } from 'three';

export function ImagePlane({ imageUrl, position, rotation }) {
  const texture = useLoader(TextureLoader, imageUrl);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent={true} />
    </mesh>
  );
}
