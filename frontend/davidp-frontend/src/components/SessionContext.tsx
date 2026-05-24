import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Session = {
    user?:string;
    isAdmin?:boolean;
    message?:string;
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
        }
    }
};

export const SessionContext = createContext(undefined);

type Props = {
    value:Session;
    children:ReactNode;
};
export function SessionContextProvider({value,children}:Props){

    const [session, setSession] = useState(value);

    useEffect(() => {

    },[]);

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );

}