import { useSession } from "../components/SessionContext";
import { Page } from "../components/Page";
import { BACKEND } from "../App";

export default function LogoutPage(){
    const session = useSession();

    const message = session.message ? <span>{session.message}</span> : <></>;

    return (<Page title="Logout">
        <h1>Logout</h1>

        {message}

        <form action={BACKEND+"/logout"} method="POST">
            <button type="submit">Log out!</button>
        </form>
    </Page>);
}