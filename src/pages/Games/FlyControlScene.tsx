import {KeyboardControls, PointerLockControls, useKeyboardControls} from '@react-three/drei'
import {Suspense, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Color, Vector3} from 'three'
import {
    CorePlugin,
    CulledMesherPlugin,
    useVoxelEngine,
    Vec3,
    VoxelChunkCulledMeshes,
    VoxelEngine
} from '../../components/common/engine'
import Loader from "../../components/loader/Loader";
import {Canvas as R3FCanvas, useFrame, useThree} from '@react-three/fiber'
import {useAppStore} from "../../store/useAppStore";
import {useParams} from "react-router-dom";
import {useGameStore} from "../../store/useGameStore";
import {useMetaMask} from "../../utils/walletConnection/useMetamask";
import {objToRgbString} from "../../utils/functions";

import {green1, green2} from "../../utils/colors";

const frontVector = new Vector3()
const sideVector = new Vector3()
const direction = new Vector3()

const Player = () => {
    const {voxelWorld, setBlock, voxelWorldActor} = useVoxelEngine<[CorePlugin, CulledMesherPlugin]>()
    const {meshes, removeMesh, setMeshes, addMesh} = useAppStore()
    const position = useRef<Vector3>(new Vector3(0, 5, 0))
    const {id} = useParams()
    const {currentColor} = useGameStore()
    const [, getControls] = useKeyboardControls()
    const {world} = useGameStore()
    const {status, account} = useMetaMask()
    const hasRunOnce = useRef(false);

    const gl = useThree((s) => s.gl)
    const camera = useThree((s) => s.camera)

    useFrame((_, delta) => {
        const {forward, backward, left, right} = getControls() as {
            forward: boolean
            backward: boolean
            left: boolean
            right: boolean
        }

        frontVector.set(0, 0, Number(backward) - Number(forward))
        sideVector.set(Number(left) - Number(right), 0, 0)
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(1000 * delta)
            .applyEuler(camera.rotation)

        position.current.add(direction.multiplyScalar(delta))
        camera.position.lerp(position.current, 10 * delta)
        voxelWorldActor.position.copy(position.current)
    })

    const onClick = (event: MouseEvent) => {
        const vec3 = new Vector3()
        const origin = camera.position.toArray()
        const direction = camera.getWorldDirection(vec3).toArray()

        const ray = voxelWorld.traceRay(origin, direction)

        if (!ray.hit) return

        if (event.button === 2) {
            const block: Vec3 = [
                Math.floor(ray.hitPosition[0]),
                Math.floor(ray.hitPosition[1]),
                Math.floor(ray.hitPosition[2]),
            ]
            if (block[1] >= -5) {
                setBlock(block, {solid: false})
                removeMesh(block)
            }
        } else {
            const block: Vec3 = [
                Math.floor(ray.hitPosition[0] + ray.hitNormal[0]),
                Math.floor(ray.hitPosition[1] + ray.hitNormal[1]),
                Math.floor(ray.hitPosition[2] + ray.hitNormal[2]),
            ]
            addMesh({
                position: block,
                color: new Color(objToRgbString(currentColor)).addScalar(0).getHex()
            })
            setBlock(block, {
                solid: true,
                color: new Color(objToRgbString(currentColor)).addScalar(0).getHex(),
            })
        }
    }

    useEffect(() => {
        if (gl !== undefined && currentColor !== undefined && id !== undefined) {
            if (status === 'connected' && world?.creator?.toLowerCase() === account?.toLowerCase()) {
                gl.domElement.addEventListener('mousedown', onClick)
                return () => {
                    gl.domElement.removeEventListener('mousedown', onClick)
                }
            }
        }
    }, [gl, currentColor, id, status, world])

    useEffect(() => {
        hasRunOnce.current = false;
    }, []);

    useEffect(() => {
        if (!hasRunOnce.current) {
            for (let i = 0; i <= meshes?.length - 1; i++) {
                const block: Vec3 = [
                    Math.floor(meshes[i].position[0]),
                    Math.floor(meshes[i].position[1]),
                    Math.floor(meshes[i].position[2]),
                ]
                setBlock(block, {
                    solid: true,
                    color: meshes[i]?.color
                })
            }
            hasRunOnce.current = true;
        }
        if (meshes?.length !== 0) {
            hasRunOnce.current = true;
        }
    }, [meshes])
    return null
}

const App = () => {
    const {step, setBlock, world} = useVoxelEngine<[CorePlugin, CulledMesherPlugin]>()
    const [paused, setPaused] = useState(true)

    useFrame((_, delta) => {
        if (paused) return
        step(delta)
    })

    useLayoutEffect(() => {
        for (let x = -70; x < 70; x++) {
            for (let y = -10; y < -5; y++) {
                for (let z = -70; z < 70; z++) {
                    setBlock([x, y, z], {
                        solid: true,
                        color: Math.random() > 0.5 ? green2 : green1,
                    })
                }
            }
        }
        setPaused(false)
    }, [world])

    return (
        <>
            <Player/>
            <VoxelChunkCulledMeshes/>
            <ambientLight intensity={0.9}/>
            <pointLight decay={0.5} intensity={10} position={[20, 20, 20]}/>
            <pointLight decay={0.5} intensity={10} position={[-20, 20, -20]}/>
        </>
    )
}

const keyboardControllers = [
    {name: 'forward', keys: ['ArrowUp', 'w', 'W']},
    {name: 'backward', keys: ['ArrowDown', 's', 'S']},
    {name: 'left', keys: ['ArrowLeft', 'a', 'A']},
    {name: 'right', keys: ['ArrowRight', 'd', 'D']},
]

const FlyControlScene = () => {
    const {world} = useGameStore()
    const {status, account} = useMetaMask()

    return <>
        {status === 'connected'
            && world?.creator?.toLowerCase() === account?.toLowerCase()
            && <div className='crosshair'/>
        }
        <KeyboardControls map={keyboardControllers}>
            <Suspense fallback={<Loader/>}>
                <R3FCanvas id="gl" camera={{near: 0.001}}>
                    <VoxelEngine plugins={[CorePlugin, CulledMesherPlugin]}>
                        <App/>
                    </VoxelEngine>
                    <PointerLockControls makeDefault/>
                </R3FCanvas>
            </Suspense>.
        </KeyboardControls>
    </>
}

export default FlyControlScene