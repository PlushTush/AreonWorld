import React, {ChangeEvent, useEffect, useState} from 'react'
import {MeshLineGeometry, MeshLineMaterial} from 'meshline'
import {extend} from '@react-three/fiber'
import {Box, Button, Callout, Card, Dialog, Flex, ScrollArea, Text, TextField} from "@radix-ui/themes";
import {useNavigate} from "react-router-dom";
import '@radix-ui/themes/styles.css';
import {ArrowLeftIcon, InfoCircledIcon, PersonIcon} from "@radix-ui/react-icons";
import * as Form from '@radix-ui/react-form';
import {WorldTableRow} from "./WorldTable";
import Confetti from "./Confetti";
import {useMetaMask} from "../../utils/walletConnection/useMetamask";
import {useWalletStore} from "../../store/useWalletStore";
import Loader from "../../components/loader/Loader";
import {WorldType} from "../../types/game";

extend({MeshLineGeometry, MeshLineMaterial})

const Worlds = () => {
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const {status, connect, account, chainId, switchChain} = useMetaMask()
    const [worldsCount, setWorldsCount] = useState(0)
    const [isLoadingWorldCount, setIsLoadingWorldCount] = useState(true)
    const {contractRead} = useWalletStore()
    const [worlds, setWorlds] = useState<WorldType[]>([])
    const [isLoadingWorlds, setIsLoadingWorlds] = useState(false)
    const [isValidAddress, setIsValidAddress] = useState(true)

    const onSearchUser = (data: any) => {
        if (/^0x([A-Fa-f0-9]{40})$/.test(data?.searchValue)) {
            setIsValidAddress(true)
            navigate(`/profile/${data?.searchValue}`)
        } else {
            setIsValidAddress(false)
        }
    }

    const onConnect = (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        connect()
    }

    useEffect(() => {
        async function getWorldCount() {
            try {
                setIsLoadingWorldCount(true)
                const count = await contractRead!.worldsCount();
                setWorldsCount(parseInt(count))
                setIsLoadingWorldCount(false)
            } catch (error) {
                console.error('Error:', error);
                setIsLoadingWorldCount(false)
            }
        }

        if (contractRead) getWorldCount()
    }, [contractRead]);

    useEffect(() => {
        const getAllWorlds = async () => {
            try {
                setIsLoadingWorlds(true)
                const arr = []
                for (let i = 1; i <= worldsCount; i++) {
                    const world = await contractRead!.getWorldInfo(i);
                    arr.push({...world, id: i})
                }
                setIsLoadingWorlds(false)
                setWorlds(arr
                    // ?.filter(item => (item.state !== '') || account?.toLowerCase() === item?.creator?.toLowerCase())
                )
            } catch (e) {
                console.log(e)
                setIsLoadingWorlds(false)
            }
        }
        if (!isLoadingWorldCount && worldsCount !== 0 && contractRead) getAllWorlds()
        else setIsLoadingWorlds(false)
    }, [worldsCount, isLoadingWorldCount, contractRead]);

    const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (/^0x([A-Fa-f0-9]{40})$/.test(e.target.value)) setIsValidAddress(true)
        else if (!isValidAddress) setIsValidAddress(false)
        setSearchValue(e.target.value)
    }

    return (
        <>
            <Confetti/>
            <Dialog.Root open={true}>
                <Dialog.Content style={{maxWidth: '90%'}}>
                    <Flex direction={'column'} gap={'3'}>
                        <Flex wrap={'wrap'} gap={'3'} justify={'between'}>
                            <Flex>
                                <Button
                                    onClick={() => navigate('/')}
                                    variant={"soft"}
                                >
                                    <ArrowLeftIcon/>
                                    Home
                                </Button>
                            </Flex>

                            {status === "connected" &&
                                <Button
                                    variant={"soft"}
                                    onClick={() => navigate(`/profile/${account.toLowerCase()}`)}
                                >
                                    <PersonIcon/>
                                    <Text>
                                        My Profile
                                    </Text>
                                </Button>
                            }

                            {(status === "notConnected" || status === "connecting") &&
                                <Button style={{backgroundColor: 'red'}} onClick={onConnect} size={'2'}>
                                    Connect
                                </Button>
                            }

                            {status === "unavailable" &&
                                <Button
                                    disabled={true} style={{backgroundColor: 'red', color: 'white'}}
                                    onClick={onConnect}
                                    size={'2'}
                                >
                                    Please install Metamask
                                </Button>
                            }
                        </Flex>

                        <Form.Root
                            className="FormRoot"
                            onSubmit={(event) => {
                                const data = Object.fromEntries(new FormData(event.currentTarget));
                                event.preventDefault();
                                onSearchUser(data)
                            }}
                        >
                            <Flex gap={'3'} justify={'start'} align={'start'}>
                                <Form.Field style={{width: '100%'}} className="FormField" name="searchValue">
                                    <Form.Control asChild>
                                        <TextField.Input
                                            value={searchValue}
                                            onChange={onChangeSearchInput}
                                            placeholder={'Search user by address'}
                                            className="Textarea"
                                            required
                                        />
                                    </Form.Control>
                                    <Flex align={'baseline'} justify={"between"}>
                                        {!isValidAddress &&
                                            <Callout.Root mt={'1'} style={{width: '100%', padding: 5}}>
                                                <Callout.Icon>
                                                    <InfoCircledIcon/>
                                                </Callout.Icon>
                                                <Callout.Text>
                                                    Invalid wallet address
                                                </Callout.Text>
                                            </Callout.Root>
                                        }
                                    </Flex>
                                </Form.Field>
                                <Form.Submit asChild>
                                    <Button className="Button">
                                        Search
                                    </Button>
                                </Form.Submit>
                            </Flex>
                        </Form.Root>

                        {(isLoadingWorlds || isLoadingWorldCount)
                            ? <Card style={{borderWidth: 2,}}>
                                <Flex align={'center'} justify={'center'}>
                                    <Loader/>
                                </Flex>
                            </Card>
                            : worlds?.length !== 0 &&
                            <Card style={{borderWidth: 2}}>
                                <ScrollArea type="hover" style={{maxHeight: 350, minHeight: 180}}>
                                    <Flex direction={'column'}>
                                        {worlds?.map((world, index) =>
                                            <Box
                                                key={world?.id}
                                                my={'1'}
                                            >
                                                <WorldTableRow  world={world}/>
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
export default Worlds
