import React, {memo, useEffect, useState} from 'react';
import {Box, Button, Callout, Card, Flex, Text} from "@radix-ui/themes";
import {HexColorPicker} from "react-colorful";
import {Color} from "three";
import Loader from "../loader/Loader";
import {useGameStore} from "../../store/useGameStore";
import {hexToRgb} from "../../utils/functions";
import {ColorType} from "../../pages/Worlds/ColorSelect";
import {useWalletStore} from "../../store/useWalletStore";
import {useMetaMask} from "../../utils/walletConnection/useMetamask";
import {InfoCircledIcon} from "@radix-ui/react-icons";
import {chainNetworkParams} from "../../utils/chainNetworkParams";
import {DEFAULT_USER_COLORS} from "../../utils/colors";

type MuColorsProps = {
    setIsLoadingBuyColor: (x: boolean) => void,
    isLoadingBuyColor: boolean
}

const MyColors = memo(({setIsLoadingBuyColor, isLoadingBuyColor}: MuColorsProps) => {
    const {account, status, chainId} = useMetaMask();
    const {
        userColors,
        addSelectedUserColor,
        removeSelectedUserColor,
        selectedUserColors,
        setCurrentColor
    } = useGameStore()
    const {contractWrite, contractRead} = useWalletStore()
    const {colorPrice, setUserColors} = useGameStore()
    const {world} = useGameStore()

    const [isExistColor, setIsExistColor] = useState(false)
    const [color, setColor] = useState('#ff0000')

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
            } else {
                const tx = await contractWrite?.buyColor(rgbColor!.R, rgbColor!.G, rgbColor!.B, {
                    value: parseInt(colorPrice)?.toString()
                })
                await tx.wait();
                const colors: ColorType[] = await contractRead!.getColorsOf(account?.toLowerCase());
                setUserColors(colors)
                setIsLoadingBuyColor(false)
            }
        } catch (e) {
            console.log(e)
            setIsLoadingBuyColor(false)
            setIsLoadingBuyColor(false)
        }
    }

    useEffect(() => {
        setIsExistColor(false)
    }, [color]);

    return (
        <>
            <Card mb={'2'}>
                <Flex gap="1" direction={'column'}>
                    <Card mb={'1'}>
                        <Box grow="1">
                            <Text size={'4'} weight={'medium'}>Colors hotbar (max 10):</Text>
                            <Flex mt={'2'} align={'center'} wrap={'wrap'} gap="3" width="auto">
                                {selectedUserColors?.map((color, index) =>
                                    <Box
                                        key={index}
                                        height={"6"}
                                        width={'6'}
                                        onClick={() => removeSelectedUserColor(color)}
                                        style={{
                                            backgroundColor: `rgb(${color.R}, ${color.G}, ${color.B})`,
                                            borderRadius: 10,
                                            cursor: 'pointer'
                                        }}
                                    />
                                )}
                            </Flex>
                        </Box>
                    </Card>

                    <Callout.Root style={{padding: 8}}>
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>
                            Click on color to add or remove from hotbar.
                        </Callout.Text>
                    </Callout.Root>

                    <Flex mt={'1'} align={'center'} wrap={'wrap'} gap="3" width="auto">
                        {userColors
                            ?.filter((element) =>
                                !selectedUserColors.some(item =>
                                    item.B.toString() === element.B.toString() &&
                                    item.G.toString() === element.G.toString() &&
                                    item.R.toString() === element.R.toString()
                                )
                            )
                            ?.map((color, index) =>
                                <Box
                                    key={index}
                                    height={"6"}
                                    width={'6'}
                                    onClick={() => addSelectedUserColor(color)}
                                    style={{
                                        backgroundColor: `rgb(${color.R}, ${color.G}, ${color.B})`,
                                        borderRadius: 10,
                                        cursor: 'pointer'
                                    }}
                                />
                            )}
                    </Flex>
                </Flex>
            </Card>

            {status === 'connected'
                && chainId === chainNetworkParams?.chainId
                && world?.creator?.toLowerCase() === account?.toLowerCase()
                && <Card>
                    <HexColorPicker
                        style={{padding: 10, width: '100%'}}
                        className="picker" color={color}
                        onChange={(c) => setColor(c)}
                    />
                    <Button
                        disabled={isLoadingBuyColor}
                        style={{width: '100%'}}
                        onClick={() => {
                            handleBuyColor()
                            setCurrentColor(new Color(color).addScalar(-0.02).getHex())
                        }}
                    >
                        Buy color
                    </Button>
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

            {isLoadingBuyColor &&
                <Flex mt={'2'} align={'center'} justify={'center'}>
                    <Loader size={'sm'}/>
                </Flex>
            }
        </>
    );
})

export default MyColors;