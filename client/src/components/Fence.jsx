import { useGLTF } from "@react-three/drei";
import { useGrid } from "../hooks/useGrid";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { mapAtom } from "../atoms";
import { SkeletonUtils } from 'three-stdlib'

export const Fence = ({
    item
}) => {
    const { gridPosition, size, rotation } = item;
    const { gridToVector3 } = useGrid();

    const [map] = useAtom(mapAtom);

    const { scene } = useGLTF(`/models/Fence.glb`);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
    const height = rotation === 1 || rotation === 3 ? size[0] : size[1];

    return (
        <group
            position={gridToVector3(
                gridPosition,
                width,
                height
            )}
      
        >   
        <primitive object={clone} rotation-y={((rotation || 0) * Math.PI) / 2} />
        
        </group>
    );
}