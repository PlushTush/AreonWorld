import {create} from "zustand";

export const useAppStore = create<{
    isOpenMenu: boolean,
    isThirdPerson: boolean,
    meshes: { position: number[], color: any }[],
    removeMesh: (position: number[]) => void,
    setMeshes: (meshes: { position: number[], color: any }[]) => void,
    setIsOpenMenu: (isOpen: boolean) => void,
    setIsThirdPerson: (isOpen: boolean) => void,
    addMesh: (mesh: { position: number[], color: any }) => void
}>((set) => ({
    meshes: [],
    isThirdPerson: false,
    isOpenMenu: false,
    removeMesh: (block) => set((state) => ({
        meshes: state.meshes.filter(item => !((item.position[0] === block[0]) && (item.position[1] === block[1]) && (item.position[2] === block[2])))
    })),
    setIsOpenMenu: (isOpen) => set({isOpenMenu: isOpen}),
    setIsThirdPerson: (status) => set({isThirdPerson: status}),
    setMeshes: (meshes) => set({meshes: meshes}),
    addMesh: (mesh) => set(state => ({meshes: [...state.meshes, mesh]})),
}))