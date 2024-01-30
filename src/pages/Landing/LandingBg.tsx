import React, {memo, Suspense} from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera, Stars} from "@react-three/drei";
import RocketModel from "./RocketModel";

const LandingBg = memo(() => {
    return <Canvas dpr={[1.5, 2]} linear shadows>
        <fog attach="fog" args={['#272730', 16, 30]}/>
        <ambientLight intensity={2}/>
        <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={75}>
            <pointLight intensity={1} position={[-10, -25, -10]}/>
            <spotLight
                castShadow intensity={2.25}
                angle={0.2}
                penumbra={1}
                position={[-25, 20, -15]}
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0001}
            />
        </PerspectiveCamera>
        <Suspense fallback={null}>
            <RocketModel url="/scene.glb"/>
        </Suspense>
        <OrbitControls
            autoRotate enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
        />
        <Stars radius={500} depth={50} count={1000} factor={10}/>
    </Canvas>
})

export default LandingBg