import { useEffect } from "react"
import { useLocation } from "react-router-dom";
import { BACKEND } from "../App";

export default function ForgotPasswordRedirectPage(){

    const location = useLocation();

    useEffect(()=>{
        fetch(BACKEND+location.pathname+location.search,
            {method:'POST',
            redirect:'follow',
            credentials:'include'})
        .then((r)=>{
            console.log(r);
            window.location.href = r.url;
        });
    },[]);
    
    return <></>
}