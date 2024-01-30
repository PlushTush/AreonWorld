import React, {memo, useMemo, useRef} from 'react';
import {Canvas, useFrame} from "@react-three/fiber";
import {Bloom, EffectComposer} from "@react-three/postprocessing";
import * as THREE from "three";

const colors = [[10, 0.5, 2], [1, 2, 10], '#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff']

function Fatline({curve, width, color, speed, dash}: any) {
    const ref = useRef()
    // @ts-ignore
    useFrame((state, delta) => (ref.current.material.dashOffset -= (delta * speed) / 10))
    return (
        // @ts-ignore
        <mesh ref={ref}>
            {/*// @ts-ignore*/}
            <meshLineGeometry points={curve}/>
            {/*// @ts-ignore*/}
            <meshLineMaterial
                transparent
                lineWidth={width}
                color={color}
                depthWrite={false}
                dashArray={0.25}
                // @ts-ignore
                dashRatio={dash}
                toneMapped={false}
            />
        </mesh>
    )
}

function Lines({dash, count, colors, radius = 50, rand = THREE.MathUtils.randFloatSpread}: any) {
    const lines = useMemo(() => {
        return Array.from({length: count}, () => {
            const pos = new THREE.Vector3(rand(radius), rand(radius), rand(radius))
            const points = Array.from({length: 10}, () => pos.add(new THREE.Vector3(rand(radius), rand(radius), rand(radius))).clone())
            const curve = new THREE.CatmullRomCurve3(points).getPoints(300)
            return {
                color: colors[parseInt((colors.length * Math.random()).toString())],
                width: Math.max(radius / 100, (radius / 50) * Math.random()),
                speed: Math.max(0.1, 1 * Math.random()),
                curve: curve.flatMap((point) => point.toArray())
            }
        })
    }, [colors, count, radius])
    return lines.map((props, index) => <Fatline key={index} dash={dash} {...props} />)
}


const Confetti = memo(() => {
    return (
        <Canvas camera={{position: [0, 0, 5], fov: 90}}>
            <color attach="background" args={['#101020']}/>
            <Lines
                dash={0.9}
                count={50}
                radius={50}
                colors={colors}
            />
            <EffectComposer>
                <Bloom mipmapBlur luminanceThreshold={1} radius={0.6}/>
            </EffectComposer>
        </Canvas>
    );
})

export default Confetti;