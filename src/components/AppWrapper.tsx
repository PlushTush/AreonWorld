import {useEffect} from "react";
import {useMetaMask} from "../utils/walletConnection/useMetamask";
import {useWalletStore} from "../store/useWalletStore";
import {useGameStore} from "../store/useGameStore";
import {ethers} from "ethers";
import {CONTRACT_ADDRESS} from "../utils/contracts";
import {CONTRACT_ABI} from "../utils/abis";
import {Outlet} from "react-router-dom";
import {chainNetworkParams} from "../utils/chainNetworkParams";

const AppWrapper = () => {
    const {status} = useMetaMask()
    const {setContractRead, setContractWrite} = useWalletStore()
    const {setWorldPrice, setColorPrice} = useGameStore()
    
    useEffect(() => {
        const setData = async () => {
            const providerRead = new ethers.providers.JsonRpcProvider(chainNetworkParams.rpcUrls[0]);
            const contractRead = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, providerRead);

            const worldPrice = await contractRead!.WORLD_PRICE();
            const colorPrice = await contractRead!.COLOR_PRICE();

            if (status === 'connected') {
                const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = metamaskProvider.getSigner();
                const contractWrite = contractRead.connect(signer)
                setContractWrite(contractWrite)
            }

            setWorldPrice(worldPrice)
            setColorPrice(colorPrice)
            setContractRead(contractRead)
        }
        setData()
    }, [status]);

    return <Outlet/>
}

export default AppWrapper