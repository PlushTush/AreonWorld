import {lazy, ReactNode, Suspense} from "react";
import {createBrowserRouter} from "react-router-dom";
import {GameLayout} from "../gameLayout/GameLayout";
import AppWrapper from "../AppWrapper";
import Loader from "../loader/Loader";
import {Flex} from "@radix-ui/themes";

const Profile = lazy(() => import("../../pages/Worlds/Profile"));
const Landing = lazy(() => import('../../pages/Landing/Landing'));
const Confetti = lazy(() => import('../../pages/Worlds/Worlds'));
const Game = lazy(() => import('../../pages/Games/FirstPersonControl'));
const FlyControlScene = lazy(() => import('../../pages/Games/FlyControlScene'));
const BuildingMode = lazy(() => import('../../pages/Games/BuildingMode'));

export const CustomReactSuspense = ({children}: { children: ReactNode }) => (
    <Suspense
        fallback={<Flex align={'center'} justify={'center'} style={{width: '100vw', height: '100vh'}}><Loader/></Flex>}>
        {children}
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppWrapper/>,
        children: [
            {
                path: "/",
                element: <CustomReactSuspense>
                    <Landing/>
                </CustomReactSuspense>
            },
            {
                path: "/worlds",
                element: <CustomReactSuspense>
                    <Confetti/>
                </CustomReactSuspense>,
            },
            {
                path: "/profile/:id",
                element: <CustomReactSuspense>
                    <Profile/>
                </CustomReactSuspense>,
            },
            {
                path: "game/:id",
                element: <CustomReactSuspense>
                    <GameLayout/>
                </CustomReactSuspense>,
                children: [
                    {
                        path: "first_control",
                        element: <CustomReactSuspense><Game/></CustomReactSuspense>,
                    },
                    {
                        path: "fly",
                        element: <CustomReactSuspense><FlyControlScene/></CustomReactSuspense>,
                    },
                    {
                        path: "building",
                        element: <CustomReactSuspense><BuildingMode/></CustomReactSuspense>,
                    },
                ],
            },
        ]
    }
]);