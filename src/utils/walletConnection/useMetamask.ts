import * as React from "react";
import { MetamaskContext } from "./metamaskContext";

export function useMetaMask() {
    const context = React.useContext(MetamaskContext);
    if (!context) {
        throw new Error("`useMetamask` should be used within a `MetaMaskProvider`");
    }
    return context;
}

export function useConnectedMetaMask() {
    const context = useMetaMask();
    // @ts-ignore
    if (context?.status! !== "connected") {
        throw new Error(
            "`useConnectedMetaMask` can only be used when the user is connected"
        );
    }
    return context;
}