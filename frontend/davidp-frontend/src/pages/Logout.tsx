import { useContext } from "react";
import { SessionContext, type Session } from "../components/SessionContext";
import { Page } from "../components/Page";
import { BACKEND } from "../App";

export default function LogoutPage(){
    const session:Session = (useContext(SessionContext) as any) as Session;
    if(session == undefined)return <>not yet brooo</>
    const message = session.message ? <span>{session.message}</span> : <></>;

    return (<Page title="Logout">
        <h1>Logout</h1>

        {message}

        <form action={BACKEND+"/logout"} method="POST">
            <button type="submit">Log out!</button>
        </form>
    </Page>);
}