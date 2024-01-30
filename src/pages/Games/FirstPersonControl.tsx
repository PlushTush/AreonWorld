import {KeyboardControls, PointerLockControls, useKeyboardControls} from '@react-three/drei'
import {Canvas as R3FCanvas, useFrame, useThree} from '@react-three/fiber'
import {Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {Color, PerspectiveCamera, Vector3} from 'three'
import {
    BoxCharacterControllerCameraComponent,
    BoxCharacterControllerComponent,
    BoxCharacterControllerInputComponent,
    BoxCharacterControllerPlugin,
    CorePlugin,
    CulledMesherPlugin,
    Object3DComponent,
    useVoxelEngine,
    Vec3,
    VoxelChunkCulledMeshes,
    VoxelEngine
} from '../../components/common/engine'
import Loader from '../../components/loader/Loader'
import {useAppStore} from "../../store/useAppStore";
import {useParams} from "react-router-dom";
import {useGameStore} from "../../store/useGameStore";
import {useMetaMask} from "../../utils/walletConnection/useMetamask";
import {objToRgbString} from "../../utils/functions";

import {green1, green2} from "../../utils/colors";

const Player = () => {
    const {ecs, voxelWorld, setBlock} = useVoxelEngine<[CorePlugin, CulledMesherPlugin]>()
    const {id} = useParams()
    const {status, account} = useMetaMask()
    const {world} = useGameStore()
    const hasRunOnce = useRef(false);
    const gl = useThree((s) => s.gl)
    const {meshes, setMeshes, addMesh, removeMesh} = useAppStore()
    const {currentColor} = useGameStore()
    const camera = useThree((s) => s.camera)

    const [, getControls] = useKeyboardControls()

    const options = useMemo(
        () => ({
            width: 0.8,
            height: 2,
            initialPosition: new Vector3(0, 1, 0),
        }),
        [],
    )

    const input = useMemo(
        () => ({
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
        }),
        [],
    )

    useFrame(() => {
        const {forward, backward, left, right, jump} = getControls() as {
            forward: boolean
            backward: boolean
            left: boolean
            right: boolean
            jump: boolean
        }

        input.forward = forward
        input.backward = backward
        input.left = left
        input.right = right
        input.jump = jump
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
            removeMesh(block)
            if (block[1] >= -5) {
                setBlock(block, {solid: false})
            }
        } else {
            const block: Vec3 = [
                Math.floor(ray.hitPosition[0] + ray.hitNormal[0]),
                Math.floor(ray.hitPosition[1] + ray.hitNormal[1]),
                Math.floor(ray.hitPosition[2] + ray.hitNormal[2]),
            ]
            setBlock(block, {
                solid: true,
                color: new Color(objToRgbString(currentColor)).addScalar(0).getHex()
            })
            addMesh({
                position: block,
                color: new Color(objToRgbString(currentColor)).addScalar(0).getHex(),
            })
        }
    }

    useEffect(() => {
        if (status === 'connected' && world?.creator?.toLowerCase() === account?.toLowerCase()) {
            gl.domElement.addEventListener('mousedown', onClick)
            return () => {
                gl.domElement.removeEventListener('mousedown', onClick)
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

    return (
        <ecs.Entity>
            <ecs.Component type={Object3DComponent}>
                <mesh>
                    <boxGeometry args={[0.8, 2, 0.8]}/>
                    <meshStandardMaterial color="red"/>
                </mesh>
            </ecs.Component>
            <ecs.Component type={BoxCharacterControllerCameraComponent} args={[camera as PerspectiveCamera]}/>
            <ecs.Component type={BoxCharacterControllerInputComponent} args={[input]}/>
            <ecs.Component type={BoxCharacterControllerComponent} args={[options]}/>
        </ecs.Entity>
    )
}

const App = () => {
    const {
        world,
        setBlock,
        step,
    } = useVoxelEngine<[CorePlugin, CulledMesherPlugin, BoxCharacterControllerPlugin]>()

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
    {name: 'jump', keys: ['Space']},
]

const FirstPersonControl = () => {
    const {id} = useParams()
    const {world} = useGameStore()
    const {status, account} = useMetaMask()

    return (
        <>
            {status === 'connected'
                && world?.creator?.toLowerCase() === account?.toLowerCase()
                && <div className='crosshair'/>
            }
            <KeyboardControls map={keyboardControllers}>
                <Suspense fallback={<Loader/>}>
                    <R3FCanvas id="gl">
                        <VoxelEngine paused plugins={[CorePlugin, CulledMesherPlugin, BoxCharacterControllerPlugin]}>
                            <App/>
                        </VoxelEngine>
                        <PointerLockControls makeDefault/>
                    </R3FCanvas>
                </Suspense>
            </KeyboardControls>
        </>
    )
}

export default FirstPersonControl