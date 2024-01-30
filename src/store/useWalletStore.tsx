import {create} from "zustand";
import {Contract} from "ethers";

export const useWalletStore = create<{
    contractRead: Contract | null,
    contractWrite: Contract | null,
    setContractRead: (contract: Contract) => void,
    setContractWrite: (contract: Contract) => void
}>((set) => ({
    contractRead: null,
    contractWrite: null,
    setContractRead: (contract) => set({contractRead: contract}),
    setContractWrite: (contract) => set({contractWrite: contract}),
}))