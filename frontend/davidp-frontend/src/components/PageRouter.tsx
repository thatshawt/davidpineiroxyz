import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";


export type RoutablePageProps = {
    setupSoundFxDynamic: () => void;
};

type Props = {
    pathPrefix:string;
    routes: Array<{path:string, page:JSX.Element}>;
};

export function PageRouter({pathPrefix,routes}:Props){
    return (
    <Routes>
        {routes.map((route)=>
            <Route path={pathPrefix+route.path} element={route.page}/>
        )}
    </Routes>
    );
}