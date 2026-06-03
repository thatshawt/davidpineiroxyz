import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";


export type RoutablePageProps = {
    setupSoundFxDynamic: () => void;
};

type Props = {
    pathPrefix:string;
    routes: Array<{path:string, page:JSX.Element}>;
    index:JSX.Element;
};

export function PageRouter({pathPrefix,routes,index}:Props){
    return (
    <Routes>
        <Route index element={index}/>
        {routes.map((route)=>
            <Route path={pathPrefix+route.path} element={route.page}/>
        )}
    </Routes>
    );
}