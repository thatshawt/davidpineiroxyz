import Link from "../components/Link";
import { Page } from "../components/Page";

export default function CalileaningPage(){
    return (<Page title="CALI LEANING" extraClasses="lean">
        <h1>Cali Leaning</h1>

        <p><Link href="https://soundcloud.com/yungorion05/california-leaning">https://soundcloud.com/yungorion05/california-leaning</Link></p>
        <p><Link href="https://www.instagram.com/yungorion">https://www.instagram.com/yungorion</Link></p>

        <p>all the lean is pink!!!</p>

        <br/>

        <video controls>
            <source src="/static/qr/cali_leaning.webm" type="video/webm"/>
        </video>
        <br/>
        <br/>
        <div className="inner-box"><Link href="/dog">Dog Exhibit</Link></div>
    </Page>);
}