// @ts-nocheck
import { type ReactNode, useContext, useEffect } from "react";

import { setupSoundsFXDynamic } from "../components/AudioSystem";
import { type Session, SessionContext, clearMessageAndUpdate } from "./SessionContext";
import { useLocation, useSearchParams } from "react-router-dom";

type Props = {
  title: string;
  children?: ReactNode;
  extraClasses?:string;
};

export function Page({ title, children, extraClasses, ...props}: Props) {
    const session:Session = (useContext(SessionContext) as any) as Session;
    if(session == undefined)return <>not yet brooo</>;

    // const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const location = useLocation();
    const [search] = useSearchParams();

    useEffect(() => {
        window.scrollTo(0,0);
        // window.document.querySelector("#root div.section").scrollIntoView();

        setupSoundsFXDynamic();

        document.querySelector("head title").textContent = `DavidP | ${title}`;

        if(search.get('from') != location.pathname){
            // console.log(location.pathname+location.search);
            clearMessageAndUpdate(session);
        }else if(session.refreshSession){
            // console.log("from page");
            session.refreshSession();
        }
        // else{
        //     console.log("no session.refreshSession and no from!=thing...");
        // }
        console.log("page loaded");
    }, []);

    return (
        <div className={`section ${extraClasses || ""}`} {...props}>
            {children}
        </div>
    );
}
