import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { SocketProvider } from "./api/SocketProvider";

function App() {
  return (
    <>
      <SocketProvider />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <color attach="background" args={["black"]} />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;