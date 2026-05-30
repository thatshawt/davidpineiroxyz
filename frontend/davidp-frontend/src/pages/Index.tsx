// @ts-nocheck
import { useEffect } from "react";
import {Page} from "../components/Page";

import Turnstile from '../components/CFTurnstile';
import Link from '../components/Link';

import Badge from '../components/BadgeWeb';

export default function IndexPage() {

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
    <Page title="Home" extraClasses="flex-container">
        <fieldset className='white-box'>
          <legend><h1>DavidPineiro.xyz</h1></legend>

          <p>This is David Pineiro's website and <Link href="/page/projects">portfolio</Link>.</p>
        </fieldset>
        
        <fieldset className='white-box'>
          <legend><h2>About Me</h2></legend>
          <p>
            I like programming random things and learning about science and programming.
          </p>
        </fieldset>

        <fieldset className='white-box'>
          <legend><h2>Socials</h2></legend>
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
        </fieldset>

        <fieldset className='white-box'>
          <legend><h2>Links</h2></legend>
          <ul>
            <li><Link to="/page/projects">Projects</Link></li>
            <li><Link to="/page/readings">Readings</Link></li>
            <li><Link href={"/page/webThingies"}>Badges, Webrings, etc.</Link></li>
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
        <legend><h2>Latest Updates</h2></legend>
        <ul>
          <li>5/29/2026: Made some touch-ups on the frontend.</li>
          <li>5/27/2026: I migrated the website to use React because I want to be employed.</li>
        </ul>
      </fieldset>
        
    </Page>
    )
}