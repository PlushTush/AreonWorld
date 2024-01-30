import React, {memo, useEffect, useState} from 'react';
import {Card, Flex, RadioGroup, Text} from "@radix-ui/themes";
import {useLocation, useNavigate, useParams} from "react-router-dom";

const ViewModes = [
    {label: 'First person control', value: 'first_control'},
    {label: 'Free camera control', value: 'fly'},
    {label: 'Building mode', value: 'building'},
]

const ChangeViewMode = memo(({setIsOpenMenu}: { setIsOpenMenu: (status: boolean) => void }) => {
    const navigate = useNavigate()
    const {id} = useParams()
    const {pathname} = useLocation()
    const [sceneType, setSceneType] = useState('fly')

    useEffect(() => {
        if (pathname.includes('fly')) {
            localStorage.setItem('scene', 'fly')
            setSceneType('fly')
        } else if (pathname.includes('first_control')) {
            localStorage.setItem('scene', 'first_control')
            setSceneType('first_control')
        } else if (pathname.includes('building')) {
            localStorage.setItem('scene', 'building')
            setSceneType('building')
        }
    }, [pathname]);

    const handleOptionChange = (e: string) => {
        localStorage.setItem('scene', e)
        navigate(`/game/${id}/${e}`)
        setIsOpenMenu(false)
    };

    return (
        <Card>
            <RadioGroup.Root
                value={sceneType}
                onValueChange={handleOptionChange}
                defaultValue="fly"
            >
                <Flex gap="2" direction="column">
                    {ViewModes?.map(item =>
                        <label>
                            <Flex gap="2" align="center">
                                <RadioGroup.Item value={item.value}/>
                                <Text size="2">{item.label}</Text>
                            </Flex>
                        </label>
                    )}
                </Flex>
            </RadioGroup.Root>
        </Card>
    );
})

export default ChangeViewMode;