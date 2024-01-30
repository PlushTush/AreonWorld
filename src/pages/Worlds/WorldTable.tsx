import {useLocation, useNavigate} from "react-router-dom";
import {Badge, Button, Card, Flex, IconButton, Text, Tooltip} from "@radix-ui/themes";
import {shortAddress, timestampToDDMMYYYY} from "../../utils/functions";
import React, {useState} from "react";
import {CopyIcon, GlobeIcon} from "@radix-ui/react-icons";
import {useCopyToClipboard} from "../../hooks/useCopyToClipboard";
import {WorldType} from "../../types/game";

export const WorldTableRow = ({world}: { world: WorldType }) => {
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const [_, copyToClipboard] = useCopyToClipboard();
    const [hasCopiedText, setHasCopiedText] = useState(false)

    const onCopyUserAddress = () => {
        copyToClipboard!(world.creator)
        setHasCopiedText(true)
        setTimeout(() => {
            setHasCopiedText(false)
        }, 500)
    }

    const onCopyWorldId = () => {
        copyToClipboard!(world.id)
        setHasCopiedText(true)
        setTimeout(() => {
            setHasCopiedText(false)
        }, 500)
    }

    return <Card>
        <Flex gap={'5'} align={'center'} justify={'between'} mx={'3'}>
            <Button
                size={'2'}
                onClick={() => {
                    navigate(`/game/${world.id}/fly`)
                    window.location.reload()
                }}
            >
                <GlobeIcon/>
                Explore
            </Button>
            <Flex gap={'3'} align={'center'} justify={'between'} mx={'3'}>
                <Tooltip content={hasCopiedText ? 'Copied' : 'Copy'}>
                    <IconButton
                        size={'2'}
                        variant={"ghost"}
                        color={'gray'}
                        onClick={onCopyWorldId}
                    >
                        <CopyIcon/>
                    </IconButton>
                </Tooltip>
                <Badge style={{width: 150, paddingInline: 5, textAlign: 'center'}} color={'gray'} size={'2'}>
                    <Flex align={'center'} justify={'center'} width={'100%'}>
                        <Text align={'center'}>
                            ID: #{world.id}
                        </Text>
                    </Flex>
                </Badge>
            </Flex>
            <Badge style={{width: 150, paddingInline: 5, textAlign: 'center'}} color={'blue'} size={'2'}>
                <Flex align={'center'} justify={'center'} width={'100%'}>
                    <Text align={'center'}>
                        {shortAddress(world.title)}
                    </Text>
                </Flex>
            </Badge>
            <Flex direction={'column'} justify={'center'} align={'center'}>
                <Text weight={'bold'} color={'blue'} size={'2'}>
                    Created at:
                </Text>
                <Text align={'center'} color={'blue'} size={'2'}>
                    {timestampToDDMMYYYY(parseInt(world.createdTime.toString()), true)}
                </Text>
            </Flex>
            <Flex direction={'column'} justify={'center'} align={'center'}>
                <Text weight={'bold'} color={'blue'} size={'2'}>
                    Updated at:
                </Text>
                <Text align={'center'} color={'blue'} size={'2'}>
                    {timestampToDDMMYYYY(parseInt(world.lastUpdateTime.toString()), true)}
                </Text>
            </Flex>
            {!pathname?.includes('profile') &&
                <Flex gap={'3'} align={'center'} justify={'between'} mx={'3'}>
                    <Tooltip content={hasCopiedText ? 'Copied' : 'Copy'}>
                        <IconButton
                            size={'2'}
                            variant={"ghost"}
                            onClick={onCopyUserAddress}
                        >
                            <CopyIcon/>
                        </IconButton>
                    </Tooltip>
                    <Button
                        onClick={() => navigate(`/profile/${world.creator}`)}
                        size={'2'}
                        variant="solid"
                        highContrast
                    >
                        <Text style={{width: '100%'}} align={'center'}>
                            {shortAddress(world.creator, 20)}
                        </Text>
                    </Button>
                </Flex>
            }
        </Flex>
    </Card>
}
