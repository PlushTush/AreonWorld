import React from 'react'
import {Loader} from '@react-three/drei'
import {Button, Flex, Text} from "@radix-ui/themes";
import './Landing.css'
import {Link, useNavigate} from "react-router-dom";
import {useMetaMask} from "../../utils/walletConnection/useMetamask";
import {GlobeIcon, InfoCircledIcon, PersonIcon} from "@radix-ui/react-icons";
import LandingBg from "./LandingBg";
import {chainNetworkParams} from "../../utils/chainNetworkParams";

const Landing = () => {
    const navigate = useNavigate()
    const {status, connect, addChain, account, chainId, switchChain} = useMetaMask();

    const onConnect = async (e: any) => {
        e.stopPropagation()
        e.preventDefault()
        if (chainId !== chainNetworkParams.chainId) {
            await connect()
        } else {
            await connect()
        }
    }

    return <div className={'landing'}>
        <div className="bg"/>
        <LandingBg/>
        <div className={'header'}>
            <Text style={{lineHeight: '70px'}} size={'9'}>
                AreonWorld
            </Text>
            <br/>
            <Text size={'6'}>
                crafting your virtual reality
            </Text>
            <span></span>
            <Flex wrap={'wrap'} className={'start-button'}>
                {status === "connected" &&
                    <Button
                        style={{backgroundColor: 'peru'}}
                        onClick={() => navigate(`/profile/${account.toLowerCase()}`)}
                        size={'2'}
                    >
                        <PersonIcon/>
                        My profile
                    </Button>
                }

                {(status === "notConnected" || status === "connecting") &&
                    <Button style={{backgroundColor: 'peru'}} onClick={onConnect} size={'2'}>
                        Connect
                    </Button>
                }

                {status === "unavailable" &&
                    <Button disabled={true} style={{backgroundColor: 'red', color: 'white'}} onClick={onConnect}
                            size={'2'}>
                        Please install Metamask
                    </Button>
                }

                <Button
                    style={{backgroundColor: '#cda03f!important'}}
                    onClick={() => navigate('/worlds')}
                    size={'2'}
                >
                    <GlobeIcon/>
                    Worlds
                </Button>
            </Flex>
        </div>
        <div className="layer"/>
        <Loader/>
    </div>
}

export default Landing