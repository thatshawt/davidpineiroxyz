// @ts-nocheck
import { useState, useRef } from "react";
// import { useSession } from "../components/SessionContext";
import Link from "../components/Link";
import { Page } from "../components/Page";
import CFTurnstile from "../components/CFTurnstile";
import { ORIGIN_URL } from "../App";

export default function LoginPage(){
    const [disabled, setDisabled] = useState(true);

    const [message, setMessage] = useState(undefined);

    const turnstileKeyRef = useRef<string|null>(null);

    const usernameInputRef = useRef<HTMLInputElement | null>(null);
    const passwordInputRef = useRef<HTMLInputElement | null>(null);

    function turnstileEnable(key){
        turnstileKeyRef.current = key;
        setDisabled(false);
    }
    
    function turnstileDisable(){
        setDisabled(true);
    }

    return (<Page title="Login">
        <h1>Login</h1>

        <p><Link href="/page/signup">Click to create an account.</Link></p>

        <code>{message}</code>

        <form onSubmit={async (event)=>{
            event.preventDefault();
            const response = await fetch(`${ORIGIN_URL}/api/users/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameInputRef.current.value,
                    password: passwordInputRef.current.value,
                    ["cf-turnstile-response"]: turnstileKeyRef.current
                })
            });

            if(response.status == 200 || response.status == 201){
                setMessage("User verified!");
            }else{
                setMessage(`${(await response.json()).messages.map(msg => msg).join(',\n')}`);
            }

            return false;
        }}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" ref={usernameInputRef} />
            <br/>

            <label htmlFor="password">Password</label>
            <input type="password" name="password" ref={passwordInputRef} />
            <br/>

            <button id="loginBtn" type="submit" disabled={disabled}>Log in</button>
            <CFTurnstile callback={turnstileEnable} error_callback={turnstileDisable} expired_callback={turnstileDisable} timeout_callback={turnstileDisable}/>
        </form>

        <p><Link href="/page/forgotPassword">Click if you forgot your password.</Link></p>
    </Page>)
}