import { useContext } from "react";
import { SessionContext, type Session } from "../components/SessionContext";
import { Page } from "../components/Page";

export default function LogoutPage(){
    const session:Session = useContext(SessionContext);

    return (<Page title="Logout">
        <h1>Logout</h1>

        {session.message && <span>{session.message}</span>}

        <form action="/logout" method="POST">
            <button type="submit">Log out!</button>
        </form>
    </Page>);
}