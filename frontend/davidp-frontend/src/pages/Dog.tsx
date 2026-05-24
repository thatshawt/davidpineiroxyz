import { useEffect } from "react";
import { Page } from "../components/Page";
import Link from "../components/Link";

export default function DogPage(){

    useEffect(()=>{
        window.tippy('#beagle', {content: 'beagles are known to be very forgiving i\'ve heard', followCursor: true,});
        window.tippy('#cat', {content: 'bro\'s skeptical', followCursor: true,});
        window.tippy('#bigDog', {content: 'the one and only', followCursor: true,});
        window.tippy('#cat_lolipop', {content: `got this from <a href="https://spookysix.neocities.org/" target="_blank">spookysix.neocities.org</a>`, allowHTML:true, interactive:true});
        window.tippy('#chicken-cigarette', {content: `<a href='https://piclog.blue/' target="_blank">Follow if you dare</a>`, allowHTML:true, interactive:true});
    },[]);

    return (
<Page title="D.O.G.S">
    <h2>D.O.G.S (Dogs Or Gorilla Sisters)</h2>
    <p>Email me some photos I could add to the exhibit.</p>

    <style>{
        `div.inner-box img {
            width:400px;
        }`
    }</style>

    <div className="flex-container">
        <div className="inner-box box-red-bg ">
            <table><tbody>
                    <tr>
                        <td>First Name</td>
                        <td>Giuseppe-Von-Trillious</td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td>The Great</td>
                    </tr>
            </tbody></table>
            <img id="bigDog" loading='lazy' src="/static/media/android-chrome-512x512.png"/>
        </div>

        <div className="inner-box static-bg">
            <table><tbody>
                <tr>
                    <td>First Name</td>
                    <td>Deez Nuts</td>
                </tr>
                <tr>
                    <td>Last Name</td>
                    <td>The Fortuitous</td>
                </tr>
            </tbody></table>
            <img id="beagle" src="/copyparty/memes/beagle.jpg" loading='lazy'/>
        </div>

        <div className="inner-box">
            <table><tbody>
                <tr>
                    <td>First Name</td>
                    <td>Issa</td>
                </tr>
                <tr>
                    <td>Last Name</td>
                    <td>Cat</td>
                </tr>
            </tbody></table>
            <img id="cat" src="/copyparty/memes/cat.jpg" loading='lazy'/>
        </div>

        <div className="inner-box">
            <table><tbody>
                <tr>
                    <td>First Name</td>
                    <td>Cat-Lick</td>
                </tr>
                <tr>
                    <td>Last Name</td>
                    <td>Da'Pos'icle</td>
                </tr>
            </tbody></table>
            <img id="cat_lolipop" src="/copyparty/memes/cat_lolipop.jpg" loading='lazy'/>
        </div>

        <div className="inner-box">
            <table><tbody>
                <tr>
                    <td>First Name</td>
                    <td>Chicken-Vin</td>
                </tr>
                <tr>
                    <td>Last Name</td>
                    <td>Diesielly</td>
                </tr>
            </tbody></table>
            <img id="chicken-cigarette" src="https://piclog.blue/uploads/538/1667072330487552.jpg" loading='lazy'/>
        </div>

    </div>
</Page>
    );
}