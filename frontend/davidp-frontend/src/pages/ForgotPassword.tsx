import { useContext, useState } from "react";
import { SessionContext, type Session } from "../components/SessionContext";
import CFTurnstile from "../components/CFTurnstile";
import { Page } from "../components/Page";

function Stage1(){
    const [disabled, setDisabled] = useState(true);
    
    function turnstileEnable(){
        setDisabled(false);
    }

    function turnstileDisable(){
        setDisabled(true);
    }

    return (<>
        <form action="/forgotPassword" method="POST">
            <label htmlFor="email">Account Email</label>
            <input type="text" name="email" id="email"/>
            <br/>

            <button id="submitBtn" type="submit" disabled={disabled}>Send Recovery Email</button>

            <CFTurnstile callback={turnstileEnable} error_callback={turnstileDisable} expired_callback={turnstileDisable} timeout_callback={turnstileDisable}/>
        </form>
    </>);
}

function Stage2(){
    const session:Session = useContext(SessionContext);

    const email = session.forgotpass.stage2.email;
    const username = session.forgotpass.stage2.username;
    const code = session.forgotpass.stage2.code;

    return (<>
        <p>
            Email: <code className="inline">{ email }</code>
            <br/>
            Username: <code className="inline">{ username }</code>
        </p>
        <form action="/resetPassword" method="POST">
            <input type="hidden" value={email} name="email"/>
            <input type="hidden" value={username} name="username"/>
            <input type="hidden" value={code} name="code"/>

            <label htmlFor="password1">Password</label>
            <input type="password" name="password1" id="password1"/>
            <br/>

            <label htmlFor="password2">Password Again</label>
            <input type="password" name="password2" id="password2"/>
            <br/>

            <button id="signupBtn" type="submit">Create Account</button>
        </form>
    </>);
}

export default function ForgotPasswordPage(){
    const session:Session = useContext(SessionContext);

    return (
    <Page title="Forgot Password">
        <h1>Forgot Password</h1>

        {session.message && <span>{session.message}</span>}

        {(!session.forgotpass || (!session.forgotpass.stage2)) && <Stage1/>}
        {(session.forgotpass && session.forgotpass.stage2) && <Stage2/>}
    </Page>);
}