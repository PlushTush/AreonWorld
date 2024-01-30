import {create} from "zustand";
import {ColorType} from "../pages/Worlds/ColorSelect";
import {WorldType} from "../types/game";

export const useGameStore = create<{
    userColors: ColorType[],
    selectedUserColors: ColorType[],
    currentColor: any,
    worldPrice: string,
    colorPrice: string,
    world: WorldType | null,
    setSelectedUserColor: (color: ColorType[]) => void
    addSelectedUserColor: (color: ColorType) => void
    removeSelectedUserColor: (color: ColorType) => void
    setUserColors: (colors: ColorType[]) => void
    setWorld: (world: WorldType) => void
    setCurrentColor: (color: any) => void,
    setWorldPrice: (price: string) => void
    setColorPrice: (price: string) => void
}>((set) => ({
    world: null,
    selectedUserColors: [],
    userColors: [],
    worldPrice: '0',
    currentColor: '',
    colorPrice: '0',
    setWorld: (world) => set({world: world}),
    addSelectedUserColor: (color) => set((state) => ({
        selectedUserColors: state.selectedUserColors?.length < 10 ? [...state.selectedUserColors, color] : state.selectedUserColors
    })),
    removeSelectedUserColor: (color) => set((state) => ({
        selectedUserColors: state.selectedUserColors?.filter(item =>
           !( (parseInt(color?.G.toString()) == parseInt(item.G.toString())) &&
            (parseInt(color.B.toString()) == parseInt(item.B.toString())) &&
            (parseInt(color.R.toString()) == parseInt(item.R.toString())))
        )
    })),
    setUserColors: (colors) => set({userColors: colors}),
    setSelectedUserColor: (colors) => set({selectedUserColors: colors}),
    setCurrentColor: (color) => set({currentColor: color}),
    setWorldPrice: (price) => set({worldPrice: price}),
    setColorPrice: (price) => set({colorPrice: price}),
}))