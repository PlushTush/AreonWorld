import ReactDOM from 'react-dom/client'
import {MetaMaskProvider} from './utils/walletConnection/metamaskProvider';
import {Theme} from '@radix-ui/themes';
import {router} from "./components/routes/routes";
import {RouterProvider} from "react-router-dom";
import '@radix-ui/themes/styles.css';
import './assets/styles/index.css'
import {ThirdwebProvider} from "@thirdweb-dev/react";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <MetaMaskProvider>
        <ThirdwebProvider clientId={import.meta.env.VITE_THIRDWEB}>
            <Theme appearance="dark" style={{width: '100%', height: '100%'}}>
                <RouterProvider router={router}/>
            </Theme>
        </ThirdwebProvider>
    </MetaMaskProvider>
)
