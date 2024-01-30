import {Bounds, OrbitControls} from '@react-three/drei'
import {Canvas as R3FCanvas, ThreeEvent} from '@react-three/fiber'
import {Suspense, useEffect, useLayoutEffect, useRef} from 'react'
import {
    CorePlugin,
    CulledMesherPlugin,
    useVoxelEngine,
    Vec3,
    VoxelChunkCulledMeshes,
    VoxelEngine
} from '../../components/common/engine'
import Loader from "../../components/loader/Loader";
import {useAppStore} from "../../store/useAppStore";
import {useGameStore} from "../../store/useGameStore";
import {useMetaMask} from "../../utils/walletConnection/useMetamask";
import {Color} from "three";
import {objToRgbString} from "../../utils/functions";
import {green1, green2} from "../../utils/colors";

const App = () => {
    const {voxelWorld, setBlock} = useVoxelEngine<[CorePlugin, CulledMesherPlugin]>()
    const {meshes, setMeshes, addMesh, removeMesh} = useAppStore()
    const {currentColor} = useGameStore()
    const {status, account} = useMetaMask()
    const {world} = useGameStore()
    const hasRunOnce = useRef(false);

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
    }, [])

    const onClick = (event: ThreeEvent<MouseEvent>) => {
        if (status === 'connected' && world?.creator?.toLowerCase() === account?.toLowerCase()) {
            event.stopPropagation()

            const origin = event.ray.origin.toArray()
            const direction = event.ray.direction.toArray()

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
                    color: new Color(objToRgbString(currentColor)).addScalar(0).getHex()
                })
            }
        }
    }

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
        }
        if (meshes?.length !== 0) {
            hasRunOnce.current = true;
        }
    }, [meshes])

    return (
        <>
            <Bounds fit margin={1.5}>
                <group onPointerDown={onClick}>
                    <VoxelChunkCulledMeshes/>
                </group>
            </Bounds>
            <ambientLight intensity={0.9}/>
            <pointLight decay={0.5} intensity={10} position={[20, 20, 20]}/>
            <pointLight decay={0.5} intensity={10} position={[-20, 20, -20]}/>
        </>
    )
}

const BuildingMode = () => {
    return <>
        <Suspense fallback={<Loader/>}>
            <R3FCanvas id="gl" camera={{position: [20, 20, 20], near: 0.001}}>
                <VoxelEngine plugins={[CorePlugin, CulledMesherPlugin]}>
                    <App/>
                </VoxelEngine>
                <OrbitControls makeDefault/>
            </R3FCanvas>
        </Suspense>.
    </>
}

export default BuildingMode