import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";


export type RoutablePageProps = {
    setupSoundFxDynamic: () => void;
};

type Props = {
    routes: Array<{path:string, page:JSX.Element}>;
};

export function PageRouter({routes}:Props){
    return (
    <Routes>
        {routes.map((route)=>
            <Route path={route.path} element={route.page}/>
        )}
    </Routes>
    );
}