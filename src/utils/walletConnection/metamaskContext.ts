import {createContext} from 'react'

export type AddEthereumChainParameter = {
    chainId: string;
    blockExplorerUrls?: string[];
    chainName?: string;
    iconUrls?: string[];
    nativeCurrency?: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls?: string[];
};

type MetaMaskInitializing = {
    account: null;
    chainId: null;
    status: "initializing";
};

type MetaMaskUnavailable = {
    account: null;
    chainId: null;
    status: "unavailable";
};

type MetaMaskNotConnected = {
    account: null;
    chainId: string;
    status: "notConnected";
};

type MetaMaskConnecting = {
    account: null;
    chainId: string;
    status: "connecting";
};

type MetaMaskConnected = {
    account: string;
    chainId: string;
    status: "connected";
};

export type MetaMaskState =
    | MetaMaskInitializing
    | MetaMaskUnavailable
    | MetaMaskNotConnected
    | MetaMaskConnecting
    | MetaMaskConnected;

export type IMetaMaskContext = MetaMaskState & {
    connect: () => Promise<string[] | null>;
    addChain: (parameters: AddEthereumChainParameter) => Promise<void>;
    switchChain: (chainId: string) => Promise<void>;
    ethereum: any;
};

export const MetamaskContext = createContext<
    IMetaMaskContext | undefined
>(undefined);