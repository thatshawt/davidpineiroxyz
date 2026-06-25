import { useContext, useEffect, useRef, useState } from "react";
import { Page } from "../components/Page";
import CFTurnstile from "../components/CFTurnstile";
import { SessionContext, type Session } from "../components/SessionContext";
import { BACKEND, ORIGIN_URL } from "../App";
import { useLocation, useParams } from "react-router-dom";

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
        const success = queryParams.get("success"); // Returns null if missing
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
                    setMessage(`${(await response.json()).messages.map(msg => msg).join('\n')}`);
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

function Stage2(){
    const session:Session = useContext(SessionContext) || {};

    if(session.signup == undefined || session.signup.stage2 == undefined)return <>ERROR BRO</>

    return (<>
    <form action={BACKEND+"/signupCode"} method="POST">
        <p>
            Email: <code className="inline">{session.signup.stage2.email}</code>
            <br/>
            Username: <code className="inline">{session.signup.stage2.username}</code>
        </p>
        <input type="hidden" value={session.signup.stage2.email} name="email"/>
        <input type="hidden" value={session.signup.stage2.username} name="username"/>

        <label htmlFor="code">Code From Email</label>
        <input type="text" name="code"/>
        <br/>

        <button id="signupBtn" type="submit">Verify Code</button>
    </form>

    <p>If you didnt get the code we can send it again.</p>
    <form action={BACKEND+"/signupCodeResend"} method="POST">
        <input type="hidden" value={session.signup.stage2.email} name="email"/>
        <input type="hidden" value={session.signup.stage2.username} name="username"/>

        <button id="signupBtn" type="submit">Send Code To Email Again</button>
    </form>
    </>);
}

function Stage3(){
    const session:Session = useContext(SessionContext) || {};

    if(session.signup == undefined || session.signup.stage3 == undefined)return <>ERROR BRO</>

    return (<>
        <p>
            Email: <code className="inline">{session.signup.stage3.email}</code>
            <br/>
            Username: <code className="inline">{session.signup.stage3.username}</code>
        </p>
        <form action={BACKEND+"/signupPassword"} method="POST">
            <input type="hidden" value={session.signup.stage3.email} name="email"/>
            <input type="hidden" value={session.signup.stage3.username} name="username"/>
            <input type="hidden" value={session.signup.stage3.code} name="code"/>

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

export default function SignupPage(){
    const session:Session = useContext(SessionContext) || {};

    const message = session != undefined && session.message ? <span>{session.message}</span> : <></>;

    var inside = <Stage1/>;

    if(session == undefined || session.signup == undefined){
        inside = <Stage1/>;
    }else if(session.signup.stage3){
        inside = <Stage3/>;
    }else if(session.signup.stage2){
        inside = <Stage2/>;
    }else{
        inside = <Stage1/>;
    }

    return <Page title="Signup">
        <h1>Signup</h1>

        {message}

        {inside}
    </Page>;
}