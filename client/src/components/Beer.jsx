import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier'
import { useMemo } from 'react';
import { SkeletonUtils } from 'three-stdlib'

export function Beer({ position }) {

    const { scene } = useGLTF('/models/Beer.glb')
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

    return (
      <RigidBody 
        name={`beer-${position.join(',')}`}
        colliders="ball"  
        position={position} 
        restitution={0.4} // Higher value for more bounce
        mass={0.5}        // Adjust mass as needed
        friction={0.2}
    >
        <primitive object={clone} castShadow receiveShadow  scale={[.25, .25, .25]}   />
      </RigidBody>
    );
  }