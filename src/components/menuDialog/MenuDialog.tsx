import {Avatar, Badge, Box, Button, Card, Dialog, Flex, IconButton, Tabs, Text, Tooltip} from "@radix-ui/themes";
import {useHotkeys} from "../../hooks/useHotkeys";
import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAppStore} from "../../store/useAppStore";
import {preventDefaultClick, shortAddress} from "../../utils/functions";
import {useMetaMask} from "../../utils/walletConnection/useMetamask";
import {CopyIcon, GlobeIcon, PersonIcon, SymbolIcon} from "@radix-ui/react-icons";
import {useWalletStore} from "../../store/useWalletStore";
import {useStorageUpload} from "@thirdweb-dev/react";
import Loader from "../loader/Loader";
import {useGameStore} from "../../store/useGameStore";
import UserFallbackIcon from "../common/icons/UserFallbackIcon";
import ChangeViewMode from "./ChangeViewMode";
import MyColors from "./MyColors";
import {useCopyToClipboard} from "../../hooks/useCopyToClipboard";
import {chainNetworkParams} from "../../utils/chainNetworkParams";

const MenuDialog = () => {
    const {id} = useParams()
    const {status, connect, account, chainId, switchChain} = useMetaMask();
    const {meshes, isOpenMenu, setIsOpenMenu} = useAppStore()
    const navigate = useNavigate()
    const {mutateAsync: upload} = useStorageUpload();
    const {contractWrite} = useWalletStore()
    const [isLoadingUpdateWorld, setIsLoadingUpdateWorld] = useState(false)
    const [isLoadingBuyColor, setIsLoadingBuyColor] = useState(false)
    const {world} = useGameStore()

    const [_, copyToClipboard] = useCopyToClipboard();
    const [hasCopiedText, setHasCopiedText] = useState(false)

    useHotkeys([
        ['Escape', () => !isOpenMenu ? setIsOpenMenu(true) : () => undefined],
    ]);

    const onConnect = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        connect()
    }

    const onCopyUserAddress = () => {
        copyToClipboard!(world?.creator)
        setHasCopiedText(true)
        setTimeout(() => {
            setHasCopiedText(false)
        }, 500)
    }

    const onSaveWorld = async () => {
        try {
            setIsLoadingUpdateWorld(true)
            const ipfsRes = await upload({
                data: [{data: meshes}],
                options: {uploadWithGatewayUrl: false, uploadWithoutDirectory: true},
            });
            if (ipfsRes[0]) {
                const tx = await contractWrite?.updateWorldState(id, ipfsRes[0]?.slice(7))
                await tx.wait();
                setIsOpenMenu(false)
                setIsLoadingUpdateWorld(false)
            }
        } catch (e) {
            console.log(e)
            setIsOpenMenu(false)
            setIsLoadingUpdateWorld(false)
        }
    }

    return <>
        <Dialog.Root open={isOpenMenu} onOpenChange={setIsOpenMenu}>
            <Dialog.Content onClick={preventDefaultClick} style={{maxWidth: 450, zIndex: 10000}}>
                <Dialog.Title>
                    <Flex justify={'between'}>
                        <Text>Menu</Text>

                        {(status === "notConnected" || status === "connecting") &&
                            <Button onClick={onConnect} size={'1'}>
                                Connect wallet
                            </Button>
                        }

                        {status === "unavailable" &&
                            <Badge
                                size={'1'}
                                color='red'
                                variant={"solid"}
                                onClick={onConnect}
                            >
                                Please install Metamask
                            </Badge>
                        }

                        <Flex align={'center'} gap={'3'}>
                            <Button
                                size={'1'}
                                variant={'soft'}
                                onClick={() => navigate('/worlds')}
                            >
                                <GlobeIcon/>
                                <Text>
                                    All Worlds
                                </Text>
                            </Button>
                            {status === "connected" &&
                                <Button
                                    size={'1'}
                                    variant={"soft"}
                                    onClick={() => navigate(`/profile/${account.toLowerCase()}`)}
                                >
                                    <PersonIcon/>
                                    <Text>
                                        My Profile
                                    </Text>
                                </Button>
                            }
                        </Flex>
                    </Flex>
                </Dialog.Title>

                {status === "connected" &&
                    <Card
                        size={'1'}
                        style={{zIndex: 1000}}
                    >
                        <Flex gap="3" align="center">
                            <Avatar
                                size="3"
                                src=""
                                radius="full"
                                fallback={<UserFallbackIcon/>}
                            />
                            {world &&
                                <Box>
                                    <Flex align={'center'} gap={'3'}>
                                        <Text as="div" size="2" weight="bold">
                                            {shortAddress(world?.creator)}
                                        </Text>
                                        <Tooltip content={hasCopiedText ? 'Copied' : 'Copy'}>
                                            <IconButton
                                                size={'1'}
                                                variant={"ghost"}
                                                onClick={onCopyUserAddress}
                                            >
                                                <CopyIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Flex>
                                    <Text as="div" size="2" color="gray">
                                        ChainId: {parseInt(chainId)}
                                    </Text>
                                </Box>
                            }
                        </Flex>
                    </Card>
                }

                {world?.creator?.toLowerCase() === account?.toLowerCase()
                    ? <Tabs.Root
                        onClick={preventDefaultClick}
                        style={{zIndex: 1000}}
                        defaultValue="account"
                    >
                        <Tabs.List
                            style={{zIndex: 1000}}
                            onClick={preventDefaultClick}
                        >
                            <Tabs.Trigger
                                style={{zIndex: 1000}}
                                onClick={preventDefaultClick}
                                value="account"
                            >
                                Settings
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                style={{zIndex: 1000}}
                                onClick={preventDefaultClick}
                                value="colors"
                            >
                                Colors
                            </Tabs.Trigger>
                        </Tabs.List>
                        <Box px="4" pt="3" pb="2">
                            <Tabs.Content value="account">
                                <ChangeViewMode setIsOpenMenu={setIsOpenMenu}/>
                            </Tabs.Content>
                            <Tabs.Content value="colors">
                                <MyColors
                                    setIsLoadingBuyColor={setIsLoadingBuyColor}
                                    isLoadingBuyColor={isLoadingBuyColor}
                                />
                            </Tabs.Content>
                        </Box>
                    </Tabs.Root>
                    : <Box mt={'2'}>
                        <ChangeViewMode setIsOpenMenu={setIsOpenMenu}/>
                    </Box>
                }

                <Flex gap="3" mt="4" justify="between" align={'center'}>
                    <Button
                        style={{zIndex: 1000}}
                        variant={'outline'}
                        disabled={isLoadingUpdateWorld}
                        color="gray"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsOpenMenu(false)
                        }}
                    >
                        Cancel
                    </Button>

                    <Flex gap="3" justify="end">
                        {isLoadingUpdateWorld
                            ? <Flex align={'center'} justify={'center'}>
                                <Loader size={'sm'}/>
                            </Flex>
                            : <>
                                {status === 'connected' && chainId !== chainNetworkParams.chainId && world?.creator?.toLowerCase() === account?.toLowerCase() &&
                                    <Button
                                        color={'red'}
                                        onClick={() => switchChain(chainNetworkParams.chainId)}
                                        size={'2'}
                                    >
                                        <SymbolIcon/>
                                        Switch network to Areon Testnet
                                    </Button>
                                }
                                {world?.creator?.toLowerCase() === account?.toLowerCase() && chainId === chainNetworkParams?.chainId &&
                                    <Button disabled={isLoadingUpdateWorld} onClick={onSaveWorld}>
                                        Save world
                                    </Button>
                                }
                            </>
                        }
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    </>
}

export default MenuDialog