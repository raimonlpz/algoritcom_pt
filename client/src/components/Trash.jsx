import { useGLTF, Billboard, Text, Plane, RoundedBox } from "@react-three/drei"
import { useEffect, useMemo, useState } from "react";
import { SkeletonUtils } from 'three-stdlib'
import { useGrid } from "../hooks/useGrid";
import { useAtom } from "jotai";
import { mapAtom, playersAtom, userAtom } from "../atoms";

export const Trash = () => {
    const { scene } = useGLTF('/models/Trash.glb')
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { gridToVector3 } = useGrid();

    const [user] = useAtom(userAtom)
    const [players] = useAtom(playersAtom)

    const [counter, setCounter] = useState(0)
    
    useEffect(() => {
        setCounter(
            players.find(player => player.id === user)?.cansCount
        )
    }, [players])

    return (
        <group
            castShadow
            scale={[.3,.3, .3]}
            position={gridToVector3(
                [9, 9],
                2,
                2
            )}
            position-y={0.55}
        >
            <primitive object={clone}  />
            <Billboard
                position={[0, 3, 0]} // Adjust the position of the Billboard relative to the Trash
                follow={true} // Make the Billboard always face the camera
            >
                <RoundedBox args={[2, 2, 0.1]} radius={0.2} smoothness={4}>
                    <meshBasicMaterial attach="material" color="#ffffff" opacity={0.3} transparent />
                </RoundedBox>
                <Text
                        position-z={0.1}
                        position-y={-0.12}
                        fontSize={1.2} // Adjust the font size of the text
                        color="lime" // Set the color of the text
                        anchorX="center" // Center the text horizontally
                        anchorY="middle" // Center the text vertically
                    >
                        {counter}
                    </Text>
            </Billboard>
        </group>
    )

}