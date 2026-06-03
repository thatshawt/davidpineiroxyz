import Badge from "../components/BadgeWeb";
import InnerBoxLinkDesc from "../components/InnerBoxLinkDesc";
import Link from "../components/Link";
import { Page } from "../components/Page";

import UtilityStyles from '../Utility.module.css';
import BadgeStyles from '../components/badge.module.css';

export default function WebthingiesPage(){
return (<Page title="Web THINGSIES">

    <h1>Web Thingies</h1>

    <p>This page has lots of links to other websites and ways to link my own website.</p>

    <fieldset className='white-box'>
        <legend><h2>My Badges</h2></legend>
        <div className='flex-container'>
            <InnerBoxLinkDesc urlText="Static 88x31">
                <Link href="https://davidpineiro.xyz" forceOut={true} className={UtilityStyles.removeLinkAfter}><img src={"/static/david-badge-88x31.png"}/></Link>
                <code className={BadgeStyles.badgeCode}>{`<a target="_blank" rel="noopener noreferrer" href="https://davidpineiro.xyz/"><img src="https://davidpineiro.xyz/static/david-badge-88x31.png" alt="davidp web badge"/></a>`}</code>
            </InnerBoxLinkDesc>

            <InnerBoxLinkDesc urlText="Animated 88x31">
                <Link href="https://davidpineiro.xyz" forceOut={true} className={UtilityStyles.removeLinkAfter}><img src={"/static/david-badge-88x31.gif"}/></Link>
                <code className={BadgeStyles.badgeCode}>{`<a target="_blank" rel="noopener noreferrer" href="https://davidpineiro.xyz/"><img src="https://davidpineiro.xyz/static/david-badge-88x31.gif" alt="davidp web badge"/></a>`}</code>
            </InnerBoxLinkDesc>

            <InnerBoxLinkDesc urlText="Square 180x180">
                <Link href="https://davidpineiro.xyz" forceOut={true} className={UtilityStyles.removeLinkAfter}><img src={"/static/davidp-navlink.png"}/></Link>
                <code className={BadgeStyles.badgeCode}>{`<a target="_blank" rel="noopener noreferrer" href="https://davidpineiro.xyz/"><img src="https://davidpineiro.xyz/static/davidp-navlink.png" alt="davidp web badge"/></a>`}</code>
            </InnerBoxLinkDesc>
        </div>

    </fieldset>

    <fieldset className='white-box' id="inspirationAndTools">
        <legend><h2>Helpful Tools & Inspiration<Link href="/page/webThingies" hash="inspirationAndTools">🔗</Link></h2></legend>
        <div className="flex-container">
        <Badge url={"https://photopea.com/"} image={"/static/8831/photopea_8831.webp"} />
        <Badge url={"https://justine.lol/cosmopolitan/"} image={"/static/8831/cosmopolitan-88x31.png"} />
        </div>

        <div className="flex-container">
        <Badge url={"https://jack-dawlia.neocities.org/page/shrines/portal/aperturewebring"} image={"/static/8831/aperture-webring-blue.png"}/>
        <Badge url={"https://lilithdev.neocities.org/"} image={"https://lilithdev.neocities.org/buttons/lilithdevbtn.gif"} />
        <Badge url={"https://netsqhere.neocities.org/"} image={"https://netsqhere.neocities.org/images/netsphere_button2.gif"} />
        <Badge url={"https://tamanotchi.world/"} image={"https://tamanotchi.world/includes/img/tamanotchi.gif"} />
        <Badge url={"https://corru.observer/"} image={"/static/8831/corru.gif"} />
        <Badge url={"https://nomaakip.xyz/"} image={"https://nomaakip.xyz/img/buttons/button2.png"} />
        <Badge url={"https://dimden.dev/"} image={"/static/8831/dimden.gif"} />
        <Badge url={"https://gwern.net/"} image={"/static/8831/gwernnet_8831.webp"} />
        <Badge url={"https://zvava.org/"} image={"https://zvava.org/images/buttons/zvava.org.png"} />
        <Badge url={"https://tabf5.com/"} image={"https://tabf5.com/img/button.gif"} />
        </div>
    </fieldset>

    <fieldset className='white-box' id="webrings">
        <legend><h2>Web Rings and Ads <Link href="/page/webThingies" hash="webrings">🔗</Link></h2></legend>
        <div className="flex-container">
            <iframe width="180" height="180" style={{border:"2px dashed yellow"}} src="https://nvlk.dimden.dev/" name="neolink"></iframe>
            <iframe width="300" height="60" style={{border:"2px dashed yellow"}} src="https://hbaguette.neocities.org/bannerlink/embed.html" name="bannerlink"></iframe>

            <img
                src="/static/onlinerainbow_edit.webp"
                // src="https://ghostk.id/i/onlinerainbow.gif"
                useMap="#image-map"
                width="300" height="100"
                style={{width:"300px",height:"100px",maxWidth:"none",imageRendering:"pixelated"}} alt="A Windows style dialog box titled 'THE ONLINE WEBRING' with three clickable buttons labeled Previous, Random, and Next"
            />
            <map name="image-map">
                <area target="_top" alt="Previous" title="Previous" href="https://webring.ghostk.id/online/davidp/previous" coords="12,68,90,90" shape="rect"/>
                <area target="_top" alt="Next" title="Next" href="https://webring.ghostk.id/online/davidp/next" coords="209,67,288,91" shape="rect"/>
                <area target="_top" alt="Random" title="Random" href="https://webring.ghostk.id/online/random" coords="109,67,190,90" shape="rect"/>
                <area target="_blank" alt="The Online Webring" title="The Online Webring" href="https://webring.ghostk.id/online/" coords="10,15,289,55" shape="rect"/>
            </map>

            <iframe width="180" height="180" style={{border:"2px dashed yellow"}} src="https://evehibi.nekoweb.org/ringlink/" name="ringlink"></iframe>
        </div>
    </fieldset>

      <fieldset className='white-box'>
        <legend><h2>Cool Websites</h2></legend>
        <div className="flex-container">
<Badge url={"https://www.swyx.io/learn-in-public"} image={"/static/8831/learninpublic.gif"} />
<Badge url={"https://knoxstation.neocities.org/"} image={"https://knoxstation.neocities.org/images/knoxstation.gif"} />
<Badge url={"https://clutterbox.neocities.org/"} image={"https://clutterbox.neocities.org/Images/CB_banner.PNG"} />
<Badge url={"https://molecule31.neocities.org/"} image={"/static/8831/molecule31.gif"} />
<Badge url={"https://gifypet.neocities.org/"} image={"https://gifypet.neocities.org/images/badge.gif"} />
<Badge url={"https://dsring.neocities.org/"} image={"/static/8831/dsring.gif"} />
<Badge url={"https://scp-wiki.wikidot.com/"} image={"/static/8831/scp-88x31.gif"} />
<Badge url={"https://sheref.neocities.org/"} image={"https://sheref.neocities.org/assets/my-button.png"} />
<Badge url={"https://evehibi.nekoweb.org/"} image={"https://evehibi.nekoweb.org/button1.gif"} />
<Badge url={"https://smokepowered.com/"} image={"https://smokepowered.com/smoke.gif"} />
<Badge url={"https://howsoonisnow.org/"} image={"https://howsoonisnow.org/img/butt3.gif"} />
<Badge url={"https://squarebowl.club/"} image={"https://squarebowl.club/images/88x31/plate.gif"} />
<Badge url={"https://yummypillow.art/"} image={"https://yummypillow.art/buttons/pillow.png"} />
<Badge url={"https://magmaus3.eu.org/"} image={"https://magmaus3.eu.org/buttons/magmaus3.gif"} />
<Badge url={"https://arimelody.space/"} image={"https://arimelody.space/img/buttons/ari%20melody.gif"} />
<Badge url={"https://sepiarecord.net/"} image={"https://sepiarecord.net/assets/imgs/sepiarecord-btn.png"} />
<Badge url={"https://dasokiimo.space/"} image={"https://dasokiimo504.neocities.org/images/dasokiimo_button.gif"} />
<Badge url={"https://max.nekoweb.org/"} image={"https://max.nekoweb.org/images/button.gif"} />
<Badge url={"https://ne0nbandit.art/"} image={"https://ne0nbandit.art/img/nbbanner.png"} />
<Badge url={"https://preloading.dev/"} image={"https://preloading.dev/static/images/button.gif"} />
<Badge url={"https://bigrat.monster/"} image={"/static/8831/bigrat-88x31.png"} />
<Badge url={"https://melankorin.net/"} image={"/static/8831/melankorin.gif"} />
<Badge url={"https://baccyflap.com/"} image={"/static/8831/baccyflap.com.gif"} />
<Badge url={"https://lunabee.space/"} image={"https://lunabee.space/8831.gif"} />
<Badge url={"https://sadgrl.online/"} image={"/static/8831/sadgirl.webp"} />
<Badge url={"https://milkyway.moe/"} image={"https://milkyway.moe/milkybuttons/MiLKYStelle.gif"} />
<Badge url={"https://notnite.com/"} image={"https://notnite.com/buttons/notnite.png"} />
<Badge url={"https://rynizx.xyz/"} image={"https://rynizx.xyz/src/images/ryniButton.gif"} />
<Badge url={"https://dabric.xyz/"} image={"https://dabric.xyz/butt.png"} />
<Badge url={"https://rice.place/"} image={"https://rice.place/button/ricebandaid.gif"} />
<Badge url={"https://fleepy.tv/"} image={"https://fleepy.tv/img/fleepy.png"} />
<Badge url={"https://ghostk.id/"} image={"/static/8831/ghostk.id.gif"} />
<Badge url={"https://msx.horse/"} image={"/static/8831/msx_horse.gif"} />
<Badge url={"https://cqql.site/"} image={"https://cqql.site/button/8831button.png"} />
<Badge url={"https://soggy.cat/"} image={"/static/8831/ssoggycat-gameboyhorror.gif"} />
<Badge url={"https://libdb.so/"} image={"/static/8831/libdbso.gif"} />
<Badge url={"https://goth.zip/"} image={"https://goth.zip/_astro/button.bccee393_ZrDNs4.webp"} />
<Badge url={"https://pocl.vip/"} image={"https://pocl.vip/img/buttons/poclbutton.gif"} />
<Badge url={"https://r74n.com/"} image={"/static/8831/r74n.png"} />
<Badge url={"https://sdomi.pl/"} image={"https://sdomi.pl/img/button.bmp"} />
<Badge url={"https://jbc.lol/"} image={"https://jbc.lol/sitebutton3.png"} />
<Badge url={"https://zptr.cc/"} image={"https://zptr.cc/88x31/webring/zeroptr.png"} />
<Badge url={"https://hl2.sh/"} image={"https://hl2.sh/badges/cecilia.png"} />
<Badge url={"https://fyz.sh/"} image={"https://api.fyz.sh/button/88x31?v=20281bd"} />
        </div>
        </fieldset>

</Page>);
}