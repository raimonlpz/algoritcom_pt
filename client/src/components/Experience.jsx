import { Environment, Grid, OrbitControls, useCursor, } from "@react-three/drei"
import { Player } from "./Player"
import { useAtom } from "jotai"
import { mapAtom, playersAtom, userAtom } from "../atoms"
import { useGrid } from "../hooks/useGrid"
import { Fence } from "./Fence"
import { useEffect, useState } from "react"
import { socket } from "../api/SocketProvider"
import { useFrame, useThree } from "@react-three/fiber"
import { Trash } from "./Trash"
import { Physics, RigidBody } from "@react-three/rapier"
import { Beer } from "./Beer"


export const Experience = () => {

    const [map] = useAtom(mapAtom)
    const [user] = useAtom(userAtom)
    const [players] = useAtom(playersAtom)

    const scene = useThree((state) => state.scene);
    const { gridToVector3, vector3ToGrid } = useGrid()

    const [beers, setBeers] = useState([]);
    const [beersCollected, setBeersCollected] = useState([])

    const [onFloor, setOnFloor] = useState(false)
    useCursor(onFloor); 

    const onPlaneClicked = (e) => {
        const player = scene.getObjectByName(`player-${user}`)
        if (!player) return;
        socket.emit(
            "run",
            vector3ToGrid(player.position),
            vector3ToGrid(e.point)
        )
    }

    const spawnBeers = () => {
        if (beers.length < 10) {
            const randomX = Math.random() * map.size[0] / 2 * map.gridDivision // Random X position
            const randomZ = Math.random() * map.size[1] / 2 * map.gridDivision // Random Z position
            const position = [randomX, 5 + Math.random() * 5, randomZ]; // Ball falls from height between 5 and 10
            setBeers((beers) => [...beers, position]);
        }  
    }

    useEffect(() => {
        const interval = setInterval(spawnBeers, 200); // Spawn a new ball every 2 seconds
        setTimeout(() => {
            clearInterval(interval);
        }, 20000)
        return () => clearInterval(interval);
    }, []);


    useFrame(() => {
        const player = scene.getObjectByName(`player-${user}`)
        if (!player) return;
        const playerPosition = player.position
            beers.forEach(position => {
                const beer = scene.getObjectByName(`beer-${position.join(',')}`)
                if (
                    beersCollected.indexOf(position) === -1 &&
                    Math.floor(beer.position.x) === Math.floor(playerPosition.x) &&
                    Math.floor(beer.position.z) === Math.floor(playerPosition.z) && 
                    beer.position.y >= 0
                ) {
                    beersCollected.push(position)
                    beer.visible = false
                    socket.emit('canCollected', user)
                }
            })
    })
    
    return (
        <>
            <Environment preset="sunset" />

            <fog attach="fog" args={['black', 10, 14]} intensity={0.0104} />

            <ambientLight intensity={0.2} />
           
            <directionalLight
                position={[-4, 4, -4]}
                castShadow
                intensity={0.35}
                shadow-mapSize={[1024, 1024]}
            >
                <orthographicCamera
                    attach={"shadow-camera"}
                    args={[-map.size[0], map.size[1], 10, -10]}
                    far={map.size[0] + map.size[1]}
                />
            </directionalLight>
            <OrbitControls />
            <Physics>
                <RigidBody
                        type="cuboid"
                         rotation-x={-Math.PI / 2}
                         position-y={-0.002}
                         position-x={map.size[0] / 2}
                         position-z={map.size[1] / 2}
                         onPointerEnter={() => setOnFloor(true)}
                         onPointerLeave={() => setOnFloor(false)}
                         onClick={onPlaneClicked}
                >
                    <mesh 
                        receiveShadow
                    >
                        <planeGeometry args={map.size} />
                        <meshStandardMaterial color="#191919" />
                    </mesh>
                </RigidBody>
                <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
                <Trash />
                {
                    map.items.map((item, idx) => (
                        <Fence 
                            key={`fence-${idx}`}
                            item={item}
                        />
                    ))
                }
                {
                    players.map((player) => (
                        <Player
                            id={player.id}
                            key={player.id}
                            name={player.name}
                            position={gridToVector3(player.position)}
                            path={player.path}
                        />
                    ))
                }
      
                {
                    beers.map((position, index) => (
                        <Beer  key={index} position={position} />
                    ))
                }
            </Physics>
        </>
    )
}