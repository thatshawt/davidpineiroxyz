// @ts-nocheck
import { useContext, createContext, useEffect, useState, type ReactNode } from "react";

export type Session = {
    setSession?: React.Dispatch<React.SetStateAction<Session>>;
    refreshSession?: () => void;

    _invalid?:boolean;

    // redirected?:boolean;
    message?:string;

    user?:string;
    isAdmin?:boolean;
    signup?:{
        stage2?:{
            email:string;
            username:string;
        };
        stage3?:{
            email:string;
            username:string;
            code:string;
        };
    };
    forgotpass?:{
        stage2?:{
            email:string;
            username:string;
            code:string;
        };
    };
};

export function clearMessageAndUpdate(session:Session){
    if(session && session.refreshSession){
        fetch(BACKEND+'/clearMessage', {method:'POST'})
        .then(()=>{
            console.log("cleared message, now refreshing session!");
            session.refreshSession();
        });
    }
}

import equal from "fast-deep-equal";
import { BACKEND } from "../App";

function sessionEquals(session1:Session, session2:Session){
    
    const {setSession:caca1,refreshSession:caca2,...session1_stripped} = session1;
    const {setSession:caca3,refreshSession:caca4,...session2_stripped} = session2;

    // console.log("COMAPRING",session1_stripped, session2_stripped);

    return equal(session1_stripped, session2_stripped);
}

export const SessionContext = createContext(undefined);

export function useSession(): Session{
    const session:Session = (useContext(SessionContext) as any) as Session;
    if(session == undefined)return {};
    return session;
}

type Props = {
    defaultValue:Session;
    children:ReactNode;
};
export function SessionContextProvider({defaultValue,children}:Props){

    const [session, setSession] = useState(defaultValue);

    function tryRefreshAndLogout(ifInvalid: () => void){
        fetch(BACKEND + "/selfSession", {credentials:'include'})
        .then((idk) => idk.json())
        .then((data)=>{
            const newSession:Session = (data as Session);
            // console.log("got", newSession);
            if(newSession._invalid){
                // logout hopefully clears our session...
                fetch(BACKEND + "/logout", {method:'POST'})
                .then(()=>{
                    ifInvalid();
                });
            }else{ // its not invalid so just use it as is
                newSession.setSession = setSession;
                newSession.refreshSession = refreshSession;
                setSession((oldSession)=>{
                    if(!sessionEquals(oldSession, newSession)){
                        console.log("updated session", newSession);
                        return newSession;
                    }else{
                        // console.log("same session, no update");
                        return oldSession;
                    }
                });
            }
        }).catch(()=>{
            ifInvalid();
        });
    }

    function refreshSession(){
        tryRefreshAndLogout(()=>tryRefreshAndLogout(()=>tryRefreshAndLogout(()=>{})));
    }

    useEffect(() => {
        // console.log("from session context first load");
        refreshSession();
    },[]);

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );

}