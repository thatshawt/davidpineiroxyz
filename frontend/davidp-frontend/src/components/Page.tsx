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
    }, []);

    return (
        <div className={`section ${extraClasses || ""}`} {...props}>
            {children}
        </div>
    );
}
