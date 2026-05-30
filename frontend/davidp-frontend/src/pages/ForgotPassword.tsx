import { useState } from "react";
import { useSession } from "../components/SessionContext";
import CFTurnstile from "../components/CFTurnstile";
import { Page } from "../components/Page";
import { BACKEND } from "../App";

function Stage1(){
    const [disabled, setDisabled] = useState(true);
    
    function turnstileEnable(){
        setDisabled(false);
    }

    function turnstileDisable(){
        setDisabled(true);
    }

    return (<>
        <form action={BACKEND+"/forgotPassword"} method="POST">
            <label htmlFor="email">Account Email</label>
            <input type="text" name="email" id="email"/>
            <br/>

            <button id="submitBtn" type="submit" disabled={disabled}>Send Recovery Email</button>

            <CFTurnstile callback={turnstileEnable} error_callback={turnstileDisable} expired_callback={turnstileDisable} timeout_callback={turnstileDisable}/>
        </form>
    </>);
}

function Stage2(){
    const session = useSession();

    if(session.forgotpass == undefined || session.forgotpass.stage2 == undefined)return <>errorrrr</>;

    const email = session.forgotpass.stage2.email;
    const username = session.forgotpass.stage2.username;
    const code = session.forgotpass.stage2.code;

    return (<>
        <p>
            Email: <code className="inline">{ email }</code>
            <br/>
            Username: <code className="inline">{ username }</code>
        </p>
        <form action={BACKEND+"/resetPassword"} method="POST">
            <input type="hidden" value={email} name="email"/>
            <input type="hidden" value={username} name="username"/>
            <input type="hidden" value={code} name="code"/>

            <label htmlFor="password1">New Password</label>
            <input type="password" name="password1" id="password1"/>
            <br/>

            <label htmlFor="password2">New Password (Again)</label>
            <input type="password" name="password2" id="password2"/>
            <br/>

            <button id="signupBtn" type="submit">Reset Password</button>
        </form>
    </>);
}

export default function ForgotPasswordPage(){
    const session = useSession();

    const message = session.message ? <span>{session.message}</span> : <></>;

    return (
    <Page title="Forgot Password">
        <h1>Forgot Password</h1>

        {message}

        {(!session.forgotpass || (!session.forgotpass.stage2)) && <Stage1/>}
        {(session.forgotpass && session.forgotpass.stage2) && <Stage2/>}
    </Page>);
}