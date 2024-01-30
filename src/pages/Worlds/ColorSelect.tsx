import React, {memo} from 'react';
import {Box, Button, Flex, Popover} from "@radix-ui/themes";
import {HexColorPicker} from "react-colorful";
import {BigNumber} from "ethers";
import Loader from "../../components/loader/Loader";

export type ColorType = {
    B: BigNumber,
    G: BigNumber,
    R: BigNumber
}

const ColorSelect = memo(({isLoadingBuyColor, handleBuyColor, setColor, color}: { isLoadingBuyColor: boolean, handleBuyColor: any, setColor: (x: any) => void, color: string }) => {
    return (
        <Box style={{width: '100%', height: '100%', padding: 5}}>
            <HexColorPicker
                style={{padding: 10}}
                className="picker" color={color}
                onChange={(c) => setColor(c)}
            />

            <Popover.Close>
                {isLoadingBuyColor
                    ? <Flex style={{height: 50}} align={'center'} justify={'center'}>
                        <Loader size={'sm'}/>
                    </Flex>
                    :<Button onClick={handleBuyColor} style={{width: '100%'}} size="1">
                        Buy
                    </Button>
                }

            </Popover.Close>
        </Box>
    );
})

export default ColorSelect;