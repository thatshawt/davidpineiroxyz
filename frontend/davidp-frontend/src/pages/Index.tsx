// @ts-nocheck
import { useEffect, useState } from "react";
import {Page} from "../components/Page";

import Turnstile from '../components/CFTurnstile';
import Link from '../components/Link';

import Badge from '../components/BadgeWeb';

import { BACKEND } from "../App";

export default function IndexPage() {

  function SocialsBox(){
    const [socialInfo, setSocialInfo] = useState(undefined);

    const [turnstileEnabled, setTurnstileEnabled] = useState(false);

    function turnstileEnable(){setTurnstileEnabled(true)}
    function turnstileDisable(){setTurnstileEnabled(false)}

    if(socialInfo != undefined){
      return (<ul>
      <li>GitHub: <Link href={"https://github.com/thatshawt"}>https://github.com/thatshawt</Link></li>
      <li>Resume: <Link href={socialInfo.resume} forceOut={true}>resume.pdf</Link></li>
      <li>LinkedIn: <Link href={socialInfo.linkedin} forceOut={true}>David Pineiro</Link></li>
      <li>Email: <span>{socialInfo.email}</span></li>
    </ul>);
    }else{
      return (<>
  <ul>
    <li>GitHub: <Link href={"https://github.com/thatshawt"}>https://github.com/thatshawt</Link></li>
    <li>Resume: </li>
    <li>LinkedIn: </li>
    <li>Email: </li>
  </ul>
  <form id="turnstileForm" action="" method="" onSubmit={(e)=>{
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    fetch(BACKEND+'/getInfo', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data)
      if(data.success == "true")setSocialInfo(()=>data);
    })
    .catch(error => console.error('Error:', error));
  }}>
    <button type="submit" id="emailButton" disabled={!turnstileEnabled}><span>Click To Reveal Socials</span></button>
    <Turnstile callback={turnstileEnable} error_callback={turnstileDisable} expired_callback={turnstileDisable} timeout_callback={turnstileDisable}/>
  </form>
  </>);
    }
}

  useEffect(()=>{
    // turnstileDisable();
    window.tippy('#catvideo', {content: 'cat portal ᓚᘏᗢ O.o', followCursor: true,});
  },[]);

  return (
    <Page title="Home" extraClasses="flex-container">
      <fieldset className='white-box'>
        <legend><h1>DavidPineiro.xyz</h1></legend>

        <p>This is David Pineiro's website and <Link href="/page/projects">portfolio</Link>.</p>
      </fieldset>
      
      <fieldset className='white-box'>
        <legend><h2>About Me</h2></legend>
        <p>
          Computer Science graduate specializing in full-stack development, backend systems, and Linux infrastructure. I enjoy building scalable web applications and self-hosted solutions while continuously learning new technologies.
        </p>
      </fieldset>

      <fieldset className='white-box'>
        <legend><h2>Socials</h2></legend>
        <SocialsBox/>
      </fieldset>

      <fieldset className='white-box'>
        <legend><h2>Links</h2></legend>
        <ul>
          <li><Link to="/page/projects">Projects</Link></li>
          <li><Link to="/page/readings">Readings</Link></li>
          <li><Link href={"/page/webThingies"}>Badges, Webrings, etc.</Link></li>
          <li><Link to="https://davidp.atabook.org/">Guest Book</Link></li>
          <li><Link href={"/copyparty/"} forceOut={true}>Culture Receptacle</Link></li>
        </ul>
      </fieldset>

      <fieldset className='white-box'>
        <legend><h2>Cats; <code className="inline" style={{paddingRight:"9px"}}>ᓚᘏᗢ</code> "Meow"</h2></legend>
        {/* <div className="" style={{
          borderRadius: '400px',
          // border: '1px solid white'
        }}> */}
          <video id="catvideo" src="/static/media/cats3.webm" autoPlay={true} muted={true} loop={true} playsInline={true}></video>
        {/* </div> */}
      </fieldset>

      <fieldset className='white-box'>
        <legend><h2>Latest Changes</h2></legend>
        <ul>
          <li>6/5/2026: Added a realtime chat implemented as a microservice.</li>
          <li>6/3/2026: Changed projects to have pictures, added a Guest Book! Working on a realtime chat.</li>
          <li>5/29/2026: Made some touch-ups on the frontend.</li>
          <li>5/27/2026: I migrated the website to use React because I want to be employed.</li>
        </ul>
      </fieldset>
        
    </Page>
    )
}