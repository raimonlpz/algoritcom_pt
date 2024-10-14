/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 public/models/Drunkie.glb -o src/components/Drunkie.jsx -r public 
*/

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useGraph, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useGrid } from '../hooks/useGrid'
import { DRUNKIE_RUN_SPEED } from '../utils/constants'
import { useAtom } from 'jotai'
import { userAtom } from '../atoms'
import { socket } from "../api/SocketProvider"

export function Drunkie({
    ...props
}) {

  const position = useMemo(() => props.position, [])
  const [path, setPath] = useState();
  const { gridToVector3 } = useGrid();

  const group = useRef()
  const [user] = useAtom(userAtom)

  const sceneGlobal = useThree((state) => state.scene);

  const { scene, animations } = useGLTF('/models/Drunkie.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)
  const [animation, setAnimation] = useState("CharacterArmature|Run");

  useEffect(() => {
    const path = [];
    props.path?.forEach((gridPos) => {
      path.push(gridToVector3(gridPos));
    })
    setPath(path);
  }, [props.path])

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play()
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation]);


  useFrame(() => {

      const player = sceneGlobal.getObjectByName(`player-${user}`)
      const playerPos = player.position;
      if (
          Math.floor(group.current.position.x) === Math.floor(playerPos.x) &&
          Math.floor(group.current.position.z) === Math.floor(playerPos.z) 
      ) {
          setAnimation("CharacterArmature|Punch");
          socket.emit('canRobbed', user)
      } else {
        if (path?.length && group.current.position.distanceTo(path[0]) > 0.1) {
            const direction = group.current.position
              .clone()
              .sub(path[0])
              .normalize()
              .multiplyScalar(DRUNKIE_RUN_SPEED);
            group.current.position.sub(direction);
            group.current.lookAt(path[0]);
            setAnimation("CharacterArmature|Run");
          } else if (path?.length) {
            path.shift();
          } else {
            setAnimation("CharacterArmature|Idle");
          }
      }
      
  })

  return (
    <group ref={group} {...props} dispose={null} position={position} >
      <group name="Root_Scene">
        <group name="RootNode">
          <group name="CharacterArmature" rotation={[-Math.PI / 2, 0, 0]} scale={[25, 25, 25]}>
            <primitive object={nodes.Root} />
          </group>
          <group name="Cactoro" rotation={[-Math.PI / 2, 0, 0]} scale={54}>
            <skinnedMesh name="Cactoro_1" geometry={nodes.Cactoro_1.geometry} material={materials.Cactoro_Main} skeleton={nodes.Cactoro_1.skeleton} />
            <skinnedMesh name="Cactoro_2" geometry={nodes.Cactoro_2.geometry} material={materials.Cactoro_Secondary} skeleton={nodes.Cactoro_2.skeleton} />
            <skinnedMesh name="Cactoro_3" geometry={nodes.Cactoro_3.geometry} material={materials['Cactoro_Main.001']} skeleton={nodes.Cactoro_3.skeleton} />
            <skinnedMesh name="Cactoro_4" geometry={nodes.Cactoro_4.geometry} material={materials.Cactoro_Red} skeleton={nodes.Cactoro_4.skeleton} />
            <skinnedMesh name="Cactoro_5" geometry={nodes.Cactoro_5.geometry} material={materials.Eye_White} skeleton={nodes.Cactoro_5.skeleton} />
            <skinnedMesh name="Cactoro_6" geometry={nodes.Cactoro_6.geometry} material={materials.Eye_Black} skeleton={nodes.Cactoro_6.skeleton} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/Drunkie.glb')
