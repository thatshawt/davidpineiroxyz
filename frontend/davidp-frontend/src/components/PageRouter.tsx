import { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";


export type RoutablePageProps = {
    setupSoundFxDynamic: () => void;
};

type Props = {
    pathPrefix:string;
    routes: Array<{path:string, page:React.ComponentType}>;
    indexPage: React.ComponentType;
};

export function PageRouter({pathPrefix,routes,indexPage}:Props){
    const location = useLocation();
    const IndexPage = indexPage; // ok...
    return (
    <Suspense fallback={<div>Loading...</div>}>
        <Routes>
            <Route index element={<IndexPage/>}/>
            {routes.map((route)=>
                <Route
                    path={pathPrefix+route.path}
                    element={<route.page key={location.key}/>}/>
            )}
        </Routes>
    </Suspense>
    );
}