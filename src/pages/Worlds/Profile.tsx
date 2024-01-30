import React, {useEffect, useState} from 'react'
import {MeshLineGeometry, MeshLineMaterial} from 'meshline'
import {extend} from '@react-three/fiber'
import {
    Avatar,
    Box,
    Button,
    Callout,
    Card,
    Dialog,
    Flex,
    IconButton,
    Popover,
    ScrollArea,
    Text,
    TextField,
    Tooltip
} from "@radix-ui/themes";
import {useNavigate, useParams} from "react-router-dom";
import '@radix-ui/themes/styles.css';
import {ArrowLeftIcon, CopyIcon, Cross1Icon, GlobeIcon, InfoCircledIcon, SymbolIcon} from "@radix-ui/react-icons";
import Confetti from "./Confetti";
import ColorSelect, {ColorType} from "./ColorSelect";
import * as Form from "@radix-ui/react-form";
import {useWalletStore} from "../../store/useWalletStore";
import {useMetaMask} from "../../utils/walletConnection/useMetamask";
import {useGameStore} from "../../store/useGameStore";
import {hexToRgb, shortAddress} from "../../utils/functions";
import {BigNumber} from "ethers";
import {WorldTableRow} from './WorldTable';
import Loader from "../../components/loader/Loader";
import {WorldType} from "../../types/game";
import {useCopyToClipboard} from "../../hooks/useCopyToClipboard";
import UserFallbackIcon from "../../components/common/icons/UserFallbackIcon";
import {chainNetworkParams} from "../../utils/chainNetworkParams";
import {DEFAULT_USER_COLORS} from "../../utils/colors";

extend({MeshLineGeometry, MeshLineMaterial})

const Profile = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const {status, connect, account, chainId, ethereum, switchChain} = useMetaMask()
    const {colorPrice} = useGameStore()
    const {contractRead, contractWrite} = useWalletStore()

    const [_, copyToClipboard] = useCopyToClipboard();
    const [hasCopiedText, setHasCopiedText] = useState(false)

    const [color, setColor] = useState('#ff0000')
    const [isLoadingProfile, setIsLoadingProfile] = useState(false)
    const [profileColors, setProfileColors] = useState<ColorType[]>([])
    const [profileWorldsCount, setProfileWorldsCount] = useState(0)
    const [isLoadingWorlds, setIsLoadingWorlds] = useState(true)
    const [profileWorlds, setProfileWorlds] = useState<WorldType[]>([])
    const [isLoadingProfileColors, setIsLoadingProfileColors] = useState(true)
    const [isLoadingBuyColor, setIsLoadingBuyColor] = useState(false)
    const [isOpenColorBuyPopover, setIsOpenColorBuyPopover] = useState(false)

    const [isExistColor, setIsExistColor] = useState(false)

    const onSearchUser = (event: React.FormEvent<HTMLFormElement>) => {
        const data = Object.fromEntries(new FormData(event.currentTarget));
        event.preventDefault();
        // @ts-ignore
        onSearchUser(data?.searchValue)
    }

    const getProfileColor = async () => {
        try {
            setIsLoadingProfileColors(true)
            const colors: ColorType[] = await contractRead!.getColorsOf(id);
            setProfileColors(colors)
            setIsLoadingProfileColors(false)
        } catch (e) {
            console.log(e)
            setIsLoadingProfileColors(true)
        }
    }

    const getProfileWorlds = async () => {
        try {
            setIsLoadingWorlds(true)
            const wCount: BigNumber = await contractRead!.worldsCountOf(id);
            setProfileWorldsCount(parseInt(wCount.toString()))
            const wIds: Number[] = []
            for (let i = 0; i < parseInt(wCount.toString()); i++) {
                const x = await contractRead!.getWorldOfAddressByIndex(id, i);
                wIds.push(parseInt(x))
            }
            const wData: WorldType[] = []
            for (let i = 0; i < wIds.length; i++) {
                const x = await contractRead!.getWorldInfo(wIds[i]);
                wData.push({...x, id: wIds[i]})
            }
            setIsLoadingWorlds(false)
            setProfileWorlds(wData
                // ?.filter(item => {
                //     return (item.state !== '') || account?.toLowerCase() === item?.creator?.toLowerCase()
                // })
            )
        } catch (e) {
            console.log(e)
            setIsLoadingWorlds(false)
        }
    }

    useEffect(() => {
        const getProfileInfo = async () => {
            try {
                setIsLoadingProfile(true)
                await getProfileColor()
                setIsLoadingProfile(false)
            } catch (e) {
                console.log(e)
                setIsLoadingProfile(false)
            }
        }
        if (contractRead && id) {
            getProfileWorlds()
            getProfileInfo()
        }
    }, [contractRead, id]);

    const handleBuyColor = async () => {
        setIsLoadingBuyColor(true)
        try {
            const rgbColor = hexToRgb(color)
            const checkColorPossession: boolean = await contractRead!.checkColorPossesion(account?.toLowerCase(), rgbColor!.R, rgbColor!.G, rgbColor!.B);

            const checkDefaultColorPossession: any = DEFAULT_USER_COLORS?.find(item =>
                (rgbColor?.G == parseInt(item.G.toString())) &&
                (rgbColor.B == parseInt(item.B.toString())) &&
                (rgbColor.R == parseInt(item.R.toString()))
            )

            if (checkColorPossession || checkDefaultColorPossession) {
                setIsExistColor(true)
                setIsLoadingBuyColor(false)
                setIsOpenColorBuyPopover(false)
            } else {
                const tx = await contractWrite?.buyColor(rgbColor!.R, rgbColor!.G, rgbColor!.B, {
                    value: parseInt(colorPrice).toString()
                })
                await tx.wait();
                setIsOpenColorBuyPopover(false)
                setIsLoadingBuyColor(false)
                await getProfileColor()
            }
        } catch (e) {
            console.log(e)
            setIsOpenColorBuyPopover(false)
            setIsLoadingBuyColor(false)
        }
    }

    const onConnect = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        connect()
    }

    const onCopyUserAddress = () => {
        copyToClipboard!(id)
        setHasCopiedText(true)
        setTimeout(() => {
            setHasCopiedText(false)
        }, 500)
    }

    useEffect(() => {
        setIsExistColor(false)
    }, [color]);

    return (
        <>
            <Confetti/>
            <Dialog.Root open={true}>
                <Dialog.Content style={{maxWidth: '90%'}}>
                    <Flex direction={'column'} gap={'3'}>
                        <Flex wrap={'wrap'} gap={'3'} justify={'between'}>
                            <Button
                                size={'1'}
                                variant={'soft'}
                                onClick={() => navigate('/worlds')}
                            >
                                <ArrowLeftIcon/>
                                <Text>
                                    All Worlds
                                </Text>
                            </Button>

                            {(status === "notConnected" || status === "connecting") &&
                                <Button style={{backgroundColor: 'red'}} onClick={onConnect} size={'2'}>
                                    Connect
                                </Button>
                            }

                            {status === "unavailable" &&
                                <Button
                                    disabled={true}
                                    style={{backgroundColor: 'red', color: 'white'}}
                                    onClick={onConnect}
                                    size={'2'}
                                >
                                    Please install Metamask
                                </Button>
                            }

                            {status === 'connected' && chainId !== chainNetworkParams.chainId &&
                                <Button
                                    color={'red'}
                                    onClick={() => switchChain(chainNetworkParams.chainId)}
                                    size={'1'}
                                >
                                    <SymbolIcon/>
                                    Switch network to Areon Testnet
                                </Button>
                            }
                        </Flex>

                        <Card>
                            <Flex gap="3" align="center">
                                <Avatar
                                    size="2"
                                    radius="full"
                                    fallback={<UserFallbackIcon/>}
                                />
                                <Flex align={'center'} gap={'3'}>
                                    <Text as="div" size="3" weight="medium">
                                        {shortAddress(id!, 25)}
                                    </Text>
                                    <Tooltip content={hasCopiedText ? 'Copied' : 'Copy'}>
                                        <IconButton
                                            size={'2'}
                                            variant={"ghost"}
                                            onClick={onCopyUserAddress}
                                        >
                                            <CopyIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </Flex>
                            </Flex>
                        </Card>

                        {!isLoadingWorlds &&
                            <Card>
                                <Box mb={'2'}>
                                    <Text size={'5'} weight={'bold'}>
                                        User block colors
                                    </Text>
                                </Box>
                                <Flex gap="3">
                                    <Box grow="1">
                                        <Flex align={'center'} wrap={'wrap'} gap="3" width="auto">
                                            {(profileColors?.length !== 0 ? profileColors : DEFAULT_USER_COLORS)?.map((color, index) =>
                                                <Box
                                                    key={index}
                                                    height={"6"}
                                                    width={'6'}
                                                    style={{
                                                        backgroundColor: `rgb(${color.R}, ${color.G}, ${color.B})`,
                                                        borderRadius: 10
                                                    }}
                                                />
                                            )}
                                        </Flex>
                                    </Box>
                                </Flex>
                                {status === 'connected'
                                    && id?.toLowerCase() === account?.toLowerCase()
                                    && chainId === chainNetworkParams.chainId
                                    && <Popover.Root open={isOpenColorBuyPopover}>
                                        <Popover.Trigger
                                            style={{marginTop: 15}}
                                            onClick={() => setIsOpenColorBuyPopover(!isOpenColorBuyPopover)}
                                        >
                                            <Button
                                                variant={"surface"}
                                                disabled={isLoadingBuyColor}
                                                size={'2'}
                                            >
                                                Buy new color
                                                {' | '}
                                                {parseInt(colorPrice) / 10 ** 18}
                                                {' '}
                                                {chainNetworkParams.nativeCurrency.symbol}
                                            </Button>
                                        </Popover.Trigger>
                                        <Popover.Content align={'center'} style={{padding: '0'}}>
                                            <ColorSelect
                                                handleBuyColor={handleBuyColor}
                                                color={color}
                                                setColor={setColor}
                                                isLoadingBuyColor={isLoadingBuyColor}
                                            />
                                        </Popover.Content>
                                    </Popover.Root>
                                }
                            </Card>
                        }

                        <Flex align={'baseline'} justify={"between"}>
                            {isExistColor &&
                                <Callout.Root mt={'1'} style={{width: '100%', padding: 5}}>
                                    <Callout.Icon>
                                        <InfoCircledIcon/>
                                    </Callout.Icon>
                                    <Callout.Text>
                                        Color already exist
                                    </Callout.Text>
                                </Callout.Root>
                            }
                        </Flex>

                        {isLoadingWorlds
                            ? <Card style={{borderWidth: 2,}}>
                                <Flex align={'center'} justify={'center'}>
                                    <Loader/>
                                </Flex>
                            </Card>
                            : <Card style={{borderWidth: 2,}}>
                                <Box>
                                    <Text size={'5'} weight={'bold'}>
                                        User worlds
                                    </Text>
                                </Box>
                                {status === 'connected'
                                    && account?.toLowerCase() === id?.toLowerCase()
                                    && chainId === chainNetworkParams.chainId
                                    && <BuyNewWorld getProfileWorlds={getProfileWorlds}/>
                                }
                                <ScrollArea type="hover" style={{minHeight: 180}}>
                                    <Flex direction={'column'}>
                                        {profileWorlds[0] && profileWorlds?.map(world =>
                                            <Box key={world?.id} my={'1'}>
                                                <WorldTableRow world={world}/>
                                            </Box>
                                        )}
                                    </Flex>
                                </ScrollArea>
                            </Card>
                        }
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </>
    )
};

const BuyNewWorld = ({getProfileWorlds}: { getProfileWorlds: any }) => {
    const [worldName, setWorldName] = useState('')
    const [isOpenCreateForm, setIsOpenCreateForm] = useState(false)
    const {contractWrite} = useWalletStore()
    const [isLoadingCreateWorld, setIsLoadingCreateWorld] = useState(false)
    const {worldPrice} = useGameStore()

    const handleCreateWorld = async (data: { worldName: string }) => {
        setIsLoadingCreateWorld(true)
        try {
            const tx = await contractWrite?.createWorld(data?.worldName, {
                value: worldPrice
            })
            await tx.wait();
            getProfileWorlds()
            setIsLoadingCreateWorld(false)
            setWorldName('')
            setIsOpenCreateForm(false)
        } catch (e) {
            console.log(e)
            setIsLoadingCreateWorld(false)
        }
    }


    return <Flex mb={'2'} mt={'2'} gap={'3'} direction={'column'} align={'start'}>
        {!isOpenCreateForm &&
            <Flex gap={'5'} align={'center'} justify={'end'}>
                <Button
                    disabled={isLoadingCreateWorld}
                    variant={"surface"}
                    onClick={() => {
                        setIsOpenCreateForm(true)
                    }}
                >
                    <GlobeIcon/>
                    Create new world
                    {' | '}
                    {parseInt(worldPrice) / 10 ** 18}
                    {' '}
                    {chainNetworkParams.nativeCurrency.symbol}
                </Button>
            </Flex>
        }

        {isOpenCreateForm &&
            <Card style={{borderWidth: 2, width: '100%'}}>
                <Form.Root
                    className="FormRoot"
                    onSubmit={(event) => {
                        const data = Object.fromEntries(new FormData(event.currentTarget));
                        event.preventDefault();
                        // @ts-ignore
                        handleCreateWorld(data)
                    }}
                >
                    <Flex gap={'3'} justify={'start'} align={'start'}>
                        <Form.Field style={{width: '100%'}} className="FormField" name="worldName">
                            <Form.Control asChild>
                                <TextField.Input
                                    disabled={isLoadingCreateWorld}
                                    value={worldName}
                                    onChange={e => setWorldName(e.target.value)}
                                    placeholder={'World title'} className="Textarea"
                                    required
                                />
                            </Form.Control>
                            <div style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                justifyContent: 'space-between'
                            }}>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                </Form.Message>
                            </div>
                        </Form.Field>
                        <Form.Submit asChild>
                            {isLoadingCreateWorld
                                ? <Flex align={'center'} justify={'center'}>
                                    <Loader size={'sm'}/>
                                </Flex>
                                : <>
                                    <Button
                                        disabled={isLoadingCreateWorld}
                                        className="Button"
                                    >
                                        Create
                                    </Button>
                                    <Flex gap={'5'} align={'center'} justify={'start'}>
                                        <Button
                                            variant={"surface"}
                                            color={'red'}
                                            onClick={() => {
                                                setIsOpenCreateForm(false)
                                                setWorldName('')
                                            }}
                                        >
                                            <Cross1Icon/>
                                            Close
                                        </Button>
                                    </Flex>
                                </>
                            }
                        </Form.Submit>
                    </Flex>
                </Form.Root>
            </Card>
        }
    </Flex>
}

export default Profile
