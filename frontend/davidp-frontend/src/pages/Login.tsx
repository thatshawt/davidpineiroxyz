import { useContext, useState } from "react";
import { SessionContext, type Session } from "../components/SessionContext";
import Link from "../components/Link";
import { Page } from "../components/Page";
import CFTurnstile from "../components/CFTurnstile";
import { BACKEND } from "../App";

export default function LoginPage(){
    const [disabled, setDisabled] = useState(true);

    function turnstileEnable(){
        setDisabled(false);
    }
    
    function turnstileDisable(){
        setDisabled(true);
    }

    const session:Session = (useContext(SessionContext) as any) as Session;
    if(session == undefined)return <>not yet brooo</>
    const message = session.message ? <span>{session.message}</span> : <></>;

    return (<Page title="Login">
        <h1>Login</h1>

        <p><Link href="/signup">Click to create an account.</Link></p>

        {message}

        <form action={BACKEND+"/login"} method="POST">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username"/>
            <br/>

            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password"/>
            <br/>

            <button id="loginBtn" type="submit" disabled={disabled}>Log in</button>
            <CFTurnstile callback={turnstileEnable} error_callback={turnstileDisable} expired_callback={turnstileDisable} timeout_callback={turnstileDisable}/>
        </form>

        <p><Link href="/forgotPassword">Click if you forgot your password.</Link></p>
    </Page>)
}