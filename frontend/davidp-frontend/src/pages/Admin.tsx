// @ts-nocheck
import { useContext, useEffect } from "react";
import {Page} from "../components/Page";
import {type RoutablePage, type RoutablePageProps} from "../components/PageRouter";
import { SessionContext, type Session } from "../components/SessionContext";
import { BACKEND } from "../App";

export default function AdminPage() {

    const session:Session = (useContext(SessionContext) as any) as Session;
    if(session == undefined)return <>not yet brooo</>;
    // const message = session != undefined && session.message ? <span>{session.message}</span> : <></>;

    useEffect(()=>{
        fetch(BACKEND+"/admin/userCount")
        .then((r) => r.text())
        .then((text) => {
            document.getElementById("usercount").textContent = `User Count: ${text}`;
        });
    },[]);

    return (
    <Page title="Admin Page">
        <h1>Admin Page</h1>

        {session.message && <span style={{whiteSpace:"pre",wordBreak: "break-all"}}>{ session.message }</span>}

        <h2>Internals</h2>
        <div className="flex-container">
            <div className="inner-box">
                <form action="/admin/listAllGlobals" method="get">
                    <button type="submit">list all globals</button>
                </form>
            </div>

            <div className="inner-box">
                <form action={BACKEND+"/admin/resetAllCooldowns"} method="post">
                    <button type="submit">reset all cooldowns</button>
                </form>
            </div>
        </div>

        <h2>Signup</h2>
        <div className="flex-container">
            <div className="inner-box">
                <form action="/admin/whitelistEmailSignup" method="post">
                    <input type="text" name="email" placeholder="Email to whitelist"/>
                    <button type="submit">Whitelist Email For Signup!</button>
                </form>
            </div>

            <div className="inner-box">
                <form action="/admin/unbanSelfSignupIp" method="post"><button type="submit">unbanSelfSignupIp</button></form>
            </div>
        </div>

        <h2>User Stuff</h2>
        <div className="flex-container">
            <div className="inner-box">
                <pre id="usercount">User Count: </pre>
            </div>

            <div className="inner-box">
                <form action="/admin/listAllUsers" method="get">
                    <button type="submit">list all users</button>
                </form>
            </div>

            <div className="inner-box">
                <form action="/admin/listSingleUser" method="get">
                    <input type="text" name="username" placeholder="User to query"/>
                    <button type="submit">Query user</button>
                </form>
            </div>

            <div className="inner-box">
                <form action="/admin/deleteUser" method="post">
                    <input type="text" name="username" placeholder="User to delete"/>
                    <button type="submit">Delete User!!!!!!!!</button>
                </form>
            </div>
        </div>

        <h2>Chat Stuff</h2>
        <div className="flex-container">
            <div className="inner-box">
                <form action="/admin/chatMessagesFromTo" method="get">
                    <input type="text" name="from" placeholder="from id"/>
                    <input type="text" name="to" placeholder="to id"/>
                    <button type="submit">get messages</button>
                </form>
            </div>

            <div className="inner-box">
                <form action="/admin/chatBanUser" method="post">
                    <input type="text" name="username" placeholder="User to chat ban"/>
                    <button type="submit">!!Chat ban User!!</button>
                </form>
            </div>

            <div className="inner-box">
                <form action="/admin/chatUnbanUser" method="post">
                    <input type="text" name="username" placeholder="User to chat UNban"/>
                    <button type="submit">Chat UNban User!</button>
                </form>
            </div>

            <div className="inner-box">
                <form action="/admin/redactUserChats" method="post">
                    <input type="text" name="username" placeholder="User to redact"/>
                    <button type="submit">!Redact user!</button>
                </form>
            </div>

            <div className="inner-box">
                <form action="/admin/redactChatsFromTo" method="post">
                    <input type="text" name="from" placeholder="from id"/>
                    <input type="text" name="to" placeholder="to id"/>
                    <button type="submit">redact messages from to</button>
                </form>
            </div>
        </div>
    </Page>
    )
}