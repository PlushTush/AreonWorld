import {Vector3} from 'three'

export type Vec3 = [x: number, y: number, z: number]

export type BlockValue = { solid: false } | { solid: true; color: number }

export type VoxelChunk = {
    id: string
    position: Vector3
    solid: Uint8Array
    color: Uint32Array
    solidBuffer: SharedArrayBuffer
    colorBuffer: SharedArrayBuffer
}
