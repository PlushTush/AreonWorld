import {useAppStore} from "../../store/useAppStore";
import {useMetaMask} from "../../utils/walletConnection/useMetamask";
import {Suspense, useEffect, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import Loader from "../loader/Loader";
import {Badge, Button, Flex, IconButton} from "@radix-ui/themes";
import MenuDialog from "../menuDialog/MenuDialog";
import {Outlet, useParams} from "react-router-dom";
import {useWalletStore} from "../../store/useWalletStore";
import {useGameStore} from "../../store/useGameStore";
import {objToRgbString} from "../../utils/functions";
import {WorldStatusType, WorldType} from "../../types/game";
import {ColorType} from "../../pages/Worlds/ColorSelect";
import {IPFS_GATEWAY} from "../../utils/constants";

export const GameLayout = () => {
    const {setMeshes} = useAppStore()
    const {status, connect, account} = useMetaMask();
    const {id} = useParams()
    const {contractRead} = useWalletStore()
    const [isLoadingWorld, setIsLoadingWorld] = useState(true)
    const [worldType, setWorldtype] = useState(WorldStatusType.NOT_FOUND)
    const {world, setWorld, setUserColors} = useGameStore()
    const {selectedUserColors, setCurrentColor, setSelectedUserColor, currentColor} = useGameStore()

    const onConnect = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        connect()
    }

    useEffect(() => {
        const getCurrentWorld = async () => {
            try {
                setIsLoadingWorld(true)
                const w: WorldType = await contractRead!.getWorldInfo(id);
                setWorld(w)

                if (w && w.state === '') {
                    setWorldtype(WorldStatusType.EMPTY)
                    setIsLoadingWorld(false)
                } else if (w && w.state !== '') {
                    setWorldtype(WorldStatusType.EXISTING)
                    setMeshes([])
                    const url = `${IPFS_GATEWAY}${w.state}`;

                    await fetch(url)
                        .then(response => response.json())
                        .then(res => setMeshes(res.data))
                        .catch(error => console.error('Error fetching data:', error));

                    setIsLoadingWorld(false)
                } else if (w === null || w === undefined) {
                    setWorldtype(WorldStatusType.NOT_FOUND)
                    setIsLoadingWorld(false)
                }
            } catch (e) {
                console.log(e)
                setIsLoadingWorld(false)
            }
        }
        if (contractRead) getCurrentWorld()
    }, [contractRead]);

    useEffect(() => {
        const getUserColors = async () => {
            const colors: ColorType[] = await contractRead!.getColorsOf(account?.toLowerCase());
            setUserColors(colors)
            setSelectedUserColor(colors.slice(0, 10))
            setCurrentColor(colors[0])
        }
        if (account && contractRead) getUserColors()
    }, [account, contractRead]);

    const [currentColorIndex, setCurrentColorIndex] = useState(1)

    useEffect(() => {
        const handler = (e: any) => {
            const index = Number(e.key) === 0 ? 9 : (Number(e.key) - 1)
            // @ts-ignore
            if (index !== NaN && selectedUserColors[index]) {
                setCurrentColorIndex(index)
                setCurrentColor(selectedUserColors[index])
            }
        }
        if (selectedUserColors) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selectedUserColors]);

    useEffect(() => {
        if (selectedUserColors[currentColorIndex])
            setCurrentColor(selectedUserColors[currentColorIndex])
        else {
            setCurrentColor(selectedUserColors[selectedUserColors.length - 1])
        }
    }, [selectedUserColors]);

    return <>
        <div className='gameLayout'>
            <Badge
                variant={'soft'}
                onClick={onConnect}
                style={{backgroundColor: 'white', position: 'absolute', right: 5, top: 5, zIndex: 1000}}
            >
                Press Esc to open menu
            </Badge>

            {(status === "notConnected" || status === "connecting") &&
                <Button
                    size={'1'}
                    onClick={onConnect}
                    style={{position: 'absolute', left: 5, top: 5, zIndex: 1000}}
                >
                    Connect
                </Button>
            }

            {status === "unavailable" &&
                <Badge
                    size={'1'}
                    color='red'
                    variant={"solid"}
                    onClick={onConnect}
                    style={{position: 'absolute', left: 5, top: 5, zIndex: 1000}}
                >
                    Please install Metamask
                </Badge>
            }

            <MenuDialog/>

            {status === 'connected' && (world?.creator?.toLowerCase() === account?.toLowerCase()) &&
                <Flex
                    gap={'2'}
                    wrap={'wrap'}
                    style={{
                        position: 'absolute',
                        widows: '500px',
                        height: '50px',
                        zIndex: 1000,
                        bottom: 0
                    }}
                >
                    {selectedUserColors?.map((color, index) =>
                        <IconButton
                            key={index}
                            size={'1'}
                            style={{
                                border: currentColor === color
                                    ? '2px solid white'
                                    : '', backgroundColor: objToRgbString(color)
                            }}
                        >
                            {(index + 1) > 9 ? 0 : index + 1}
                        </IconButton>
                    )}
                </Flex>
            }
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<Loader/>}>
                    {isLoadingWorld
                        ? <Flex>
                            <Loader/>
                        </Flex>
                        : <Outlet/>
                    }
                </Suspense>
            </ErrorBoundary>
        </div>
    </>
}