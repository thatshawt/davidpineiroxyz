// @ts-nocheck
import { useContext, useEffect, useRef, useState } from "react";
import { Page } from "../components/Page";
import CFTurnstile from "../components/CFTurnstile";
import { SessionContext, type Session } from "../components/SessionContext";
import { BACKEND, ORIGIN_URL } from "../App";
import { useLocation } from "react-router-dom";

function Stage1(){
    const [disabled, setDisabled] = useState(true);
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const password1Ref = useRef<HTMLInputElement>(null);
    const password2Ref = useRef<HTMLInputElement>(null);

    const [message, setMessage] = useState(undefined);

    const location = useLocation();
    
    const turnstileKeyRef = useRef<string|null>(null);

    function turnstileEnable(key){
        turnstileKeyRef.current = key;
        setDisabled(false);
    }

    function turnstileDisable(){
        setDisabled(true);
    }

    useEffect(()=>{
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get("success");
        if(success === "true"){
            setMessage(()=>"Account is verified! You can now login to your account.");
        }
        // console.log(success);
    },[]);

    return (<>
        <p>What you get when you sign up:</p>
        <ul>
            <li>You can truthfully say "i signed up to davidpineiro.xyz!!"</li>
            {/* <li>Send messages in the chat box.</li> */}
            <li>That is all.</li>
        </ul>
        <br/>
        <code>{message}</code>

        <form
            onSubmit={async (event)=>{
                event.preventDefault();
                const response = await fetch(`${ORIGIN_URL}/api/signup/createAccount`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: usernameRef.current?.value,
                        email: emailRef.current?.value,
                        password1: password1Ref.current?.value,
                        password2: password2Ref.current?.value,
                        redirect: `${ORIGIN_URL}/page/signup?success=true`,
                        ["cf-turnstile-response"]: turnstileKeyRef.current
                    })
                });

                if(response.status == 200 || response.status == 201){
                    setMessage("Email sent, check your inbox.");
                }else{
                    setMessage(`${(await response.json()).messages.map(msg => msg).join(',\n')}`);
                }

                return false;
            }}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" ref={usernameRef}/>
            <br/>

            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" ref={emailRef}/>
            <br/>

            <label htmlFor="password1">Password</label>
            <input type="password" name="password1" id="password1" ref={password1Ref}/>
            <br/>

            <label htmlFor="password2">Password(Again)</label>
            <input type="password" name="password2" id="password2" ref={password2Ref}/>
            <br/>

            <button id="signupBtn" type="submit" disabled={disabled}>Signup</button>

            <CFTurnstile callback={turnstileEnable} error_callback={turnstileDisable} expired_callback={turnstileDisable} timeout_callback={turnstileDisable}/>
        </form>
    </>);
}

export default function SignupPage(){
    const session:Session = useContext(SessionContext) || {};

    const message = session != undefined && session.message ? <span>{session.message}</span> : <></>;

    var inside = <Stage1/>;

    return <Page title="Signup">
        <h1>Signup</h1>

        {message}

        {inside}
    </Page>;
}