import { useEffect } from "react";
import {Page} from "../components/Page";

import Turnstile from '../components/CFTurnstile';
import Link from '../components/Link';

export default function IndexPage() {

  function Badge({url, image}){
    return (<>
    <Link href={url}><img className='web-badge' loading='lazy' src={image} alt='' /></Link>
    </>)
  }

  function turnstileEnable(){
    (document.getElementById('emailButton') as HTMLButtonElement).disabled = false;
  }

  function turnstileDisable(){
    (document.getElementById('emailButton') as HTMLButtonElement).disabled = true;
  }

  useEffect(()=>{
    // turnstileDisable();
    window.tippy('#catvideo', {content: 'cat portal ᓚᘏᗢ O.o', followCursor: true,});
  },[]);

  return (
    <Page title="Home">
        <h1>DavidPineiro.xyz</h1>

        <p>This is David Pineiro's website and portfolio.</p>
        
        <h2>About Me</h2>
        <p>
          I like programming random things and learning about science and programming.
        </p>

        <h2>Socials</h2>
        <form id="turnstileForm" action="" method="" onSubmit={(e)=>{
              e.preventDefault();
              const formData = new FormData(e.currentTarget);

              fetch('/getInfo', {
                method: 'POST',
                body: formData
              })
              .then(response => response.json())
              .then(data => {
                console.log('Success:', data)
                if(data.success == "true"){
                  var email = document.getElementById("email");
                  email.textContent = data.email;

                  var resume = document.getElementById("resume") as HTMLAnchorElement;
                  resume.href = data.resume;
                  resume.textContent = "resume.pdf";
                  resume.style = "";

                  var linkedin = document.getElementById("linkedin") as HTMLAnchorElement;
                  linkedin.href = data.linkedin;
                  linkedin.textContent = data.linkedin;
                  linkedin.style = "";

                  turnstileDisable();
                }
              })
              .catch(error => console.error('Error:', error));
        }}>
          <ul>
            <li>GitHub: <Link href={"https://github.com/thatshawt"}>https://github.com/thatshawt</Link></li>
            <li>Resume: <Link href={"https://foobar"} id={"resume"}></Link></li>
            <li>LinkedIn: <Link href={"https://foobar"} id={"linkedin"}></Link></li>
            <li>
              My Email: <span className="inline" id="email"></span>
            </li>
          </ul>
          <button type="submit" id="emailButton" disabled={true}><span>Show Socials</span></button>
          <Turnstile callback={turnstileEnable} error_callback={turnstileDisable} expired_callback={turnstileDisable} timeout_callback={turnstileDisable}/>
        </form>

        <h2>Links</h2>
        <ul>
          <li><Link href={"/copyparty/"} forceOut={true}>Culture Receptacle</Link></li>
        </ul>

        <h2>Cats; <code className="inline" style={{paddingRight:"9px"}}>ᓚᘏᗢ</code> "Meow"</h2>
        <div className="static-bg inner-box">
          <video id="catvideo" src="/static/media/cats3.webm" autoPlay={true} muted={true} loop={true} playsInline={true}></video>
        </div>

        <h2>My Badges</h2>
        <table>
          <tbody>
            <tr>
              <td>Badge</td>
              <td>HTML Code</td>
            </tr>
            <tr>
              <td><div>Static (3.2 KiB):</div>
              <Badge url={"https://davidpineiro.xyz"} image={"/static/david-badge-88x31.png"}/></td>
              <td><code className="badge-code">{`<a target="_blank" rel="noopener noreferrer" href="https://davidpineiro.xyz/"><img src="https://davidpineiro.xyz/static/david-badge-88x31.png" alt="davidp web badge"/></a>`}</code></td>
            </tr>
            <tr>
              <td><div>Animated (15.0 KiB):</div>
              <Badge url={"https://davidpineiro.xyz"} image={"/static/david-badge-88x31.gif"}/></td>
              <td><code className="badge-code">{`<a target="_blank" rel="noopener noreferrer" href="https://davidpineiro.xyz/"><img src="https://davidpineiro.xyz/static/david-badge-88x31.gif" alt="davidp web badge"/></a>`}</code></td>
            </tr>
            <tr>
              <td><div>Square (139.9 KiB):</div>
              <Link href="https://davidpineiro.xyz" forceOut={true}><img src={"/static/davidp-navlink.png"}/></Link></td>
              <td><code className="badge-code">{`<a target="_blank" rel="noopener noreferrer" href="https://davidpineiro.xyz/"><img src="https://davidpineiro.xyz/static/davidp-navlink.png" alt="davidp web badge"/></a>`}</code></td>
            </tr>
          </tbody>
        </table>

        <h2>Other Cool Links</h2>
        <div>
<Badge url={"https://jack-dawlia.neocities.org/page/shrines/portal/aperturewebring"} image={"/static/8831/aperture-webring-blue.png"}/>
<Badge url={"https://www.swyx.io/learn-in-public"} image={"/static/8831/learninpublic.gif"} />
<Badge url={"https://clutterbox.neocities.org/"} image={"https://clutterbox.neocities.org/Images/CB_banner.PNG"} />
<Badge url={"https://justine.lol/cosmopolitan/"} image={"/static/8831/cosmopolitan-88x31.png"} />
<Badge url={"https://molecule31.neocities.org/"} image={"/static/8831/molecule31.gif"} />
<Badge url={"https://netsqhere.neocities.org/"} image={"https://netsqhere.neocities.org/images/netsphere_button2.gif"} />
<Badge url={"https://dsring.neocities.org/"} image={"/static/8831/dsring.gif"} />
<Badge url={"https://scp-wiki.wikidot.com/"} image={"/static/8831/scp-88x31.gif"} />
<Badge url={"https://sheref.neocities.org/"} image={"https://sheref.neocities.org/assets/my-button.png"} />
<Badge url={"https://evehibi.nekoweb.org/"} image={"https://evehibi.nekoweb.org/button1.gif"} />
<Badge url={"https://smokepowered.com/"} image={"https://smokepowered.com/smoke.gif"} />
<Badge url={"https://squarebowl.club/"} image={"https://squarebowl.club/images/88x31/plate.gif"} />
<Badge url={"https://yummypillow.art/"} image={"https://yummypillow.art/buttons/pillow.png"} />
<Badge url={"https://magmaus3.eu.org/"} image={"https://magmaus3.eu.org/buttons/magmaus3.gif"} />
<Badge url={"https://arimelody.space/"} image={"https://arimelody.space/img/buttons/ari%20melody.gif"} />
<Badge url={"https://sepiarecord.net/"} image={"https://sepiarecord.net/assets/imgs/sepiarecord-btn.png"} />
<Badge url={"https://max.nekoweb.org/"} image={"https://max.nekoweb.org/images/button.gif"} />
<Badge url={"https://bigrat.monster/"} image={"/static/8831/bigrat-88x31.png"} />
<Badge url={"https://corru.observer/"} image={"/static/8831/corru.gif"} />
<Badge url={"https://melankorin.net/"} image={"/static/8831/melankorin.gif"} />
<Badge url={"https://baccyflap.com/"} image={"/static/8831/baccyflap.com.gif"} />
<Badge url={"https://lunabee.space/"} image={"https://lunabee.space/8831.gif"} />
<Badge url={"https://sadgrl.online/"} image={"/static/8831/sadgirl.webp"} />
<Badge url={"https://nomaakip.xyz/"} image={"https://nomaakip.xyz/img/buttons/button2.png"} />
<Badge url={"https://milkyway.moe/"} image={"https://milkyway.moe/milkybuttons/MiLKYStelle.gif"} />
<Badge url={"https://notnite.com/"} image={"https://notnite.com/buttons/notnite.png"} />
<Badge url={"https://dimden.dev/"} image={"/static/8831/dimden.gif"} />
<Badge url={"https://dabric.xyz/"} image={"https://dabric.xyz/butt.png"} />
<Badge url={"https://rice.place/"} image={"https://rice.place/button/ricebandaid.gif"} />
<Badge url={"https://fleepy.tv/"} image={"https://fleepy.tv/img/fleepy.png"} />
<Badge url={"https://ghostk.id/"} image={"/static/8831/ghostk.id.gif"} />
<Badge url={"https://msx.horse/"} image={"/static/8831/msx_horse.gif"} />
<Badge url={"https://soggy.cat/"} image={"/static/8831/ssoggycat-gameboyhorror.gif"} />
<Badge url={"https://zvava.org/"} image={"https://zvava.org/images/buttons/zvava.org.png"} />
<Badge url={"https://libdb.so/"} image={"/static/8831/libdbso.gif"} />
<Badge url={"https://goth.zip/"} image={"https://goth.zip/_astro/button.bccee393_ZrDNs4.webp"} />
<Badge url={"https://pocl.vip/"} image={"https://pocl.vip/img/buttons/poclbutton.gif"} />
<Badge url={"https://r74n.com/"} image={"/static/8831/r74n.png"} />
<Badge url={"https://jbc.lol/"} image={"https://jbc.lol/sitebutton3.png"} />
<Badge url={"https://zptr.cc/"} image={"https://zptr.cc/88x31/webring/zeroptr.png"} />
<Badge url={"https://hl2.sh/"} image={"https://hl2.sh/badges/cecilia.png"} />
<Badge url={"https://fyz.sh/"} image={"https://api.fyz.sh/button/88x31?v=20281bd"} />
        </div>

        <iframe width="180" height="180" style={{border:"2px dashed yellow"}} src="https://nvlk.dimden.dev/" name="neolink"></iframe>
        <iframe width="300" height="60" style={{border:"2px dashed yellow"}} src="https://hbaguette.neocities.org/bannerlink/embed.html" name="bannerlink"></iframe>
    </Page>
    )
}