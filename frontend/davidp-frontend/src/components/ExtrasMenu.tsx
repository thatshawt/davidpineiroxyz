import { useContext, useState, useEffect } from "react";
import { AudioSystemContext, type AudioObj } from "./AudioSystem";

import styles from './extrasMenu.module.css';

// @ts-ignore
export default function ExtrasMenu({extrasToggled, toggleExtras}){
  const audioObj:AudioObj = (useContext(AudioSystemContext) as any) as AudioObj;

  const timeString = audioObj ? audioObj.currentTimeString : "0:00";
  const durationString = audioObj ? audioObj.currentTimeDuration : "";
  const trackName = (audioObj && audioObj.currentTrack) ? audioObj.currentTrack.title : "";
  const author = (audioObj && audioObj.currentTrack) ? audioObj.currentTrack.artist : "";

  // console.log(audioObj);

  // if(audioObj == undefined)return null;

  function PlayPauseButton(){
    const [isPlaying, setIsPlaying] = useState(false);

    const audioObj:AudioObj = (useContext(AudioSystemContext) as any) as AudioObj;
    
    function toggle(){
      if(!audioObj)return;
      const audio = audioObj.musicAudioEl;
      if(audio){
        if (audio.paused) {
          audio.play();
          setIsPlaying(true);
        } else {
          audio.pause();
          setIsPlaying(false);
        }
      }
    }

    useEffect(() => {
      //update normally
      if(!audioObj)return;
      const audio = audioObj.musicAudioEl;
      if(audio){
        if (audio.paused) {
          setIsPlaying(false);
        } else {
          setIsPlaying(true);
        }
      }

      //update every second just incase
      const interval = setInterval(()=>{
        if(!audioObj || !audioObj.musicAudioEl)return;
        setIsPlaying(!audioObj.musicAudioEl.paused);
      }, 1000);

      return () => {clearInterval(interval)}

    }, [audioObj.musicAudioEl]);

    return (<>
      <button onClick={toggle}>{isPlaying ? "⏸":"▶"}</button>
    </>)
  }

  function MusicSeekInput(){
    const audioObj:AudioObj = (useContext(AudioSystemContext) as any) as AudioObj;
    // console.log(audioObj);
    const seekValue = (audioObj) ? audioObj.currentTimeSeek : "0";
    return (<>
      <input className="music" type="range" value={seekValue} min="0" max="100" id="seek"
        onInput={(e)=>{
          const seek = e.currentTarget as HTMLInputElement;
          var audio = window.audioObj.musicAudioEl;
          if(audio){
            audio.currentTime = (Number(seek.value) / 100) * audio.duration;
          }
      }}/>
    </>)
  }

  function MusicVolumeInput(){
    const audioObj:AudioObj = (useContext(AudioSystemContext) as any) as AudioObj;
    if(audioObj.musicGainNode == undefined)return <></>;
    return (<>
      <input type="range" id="volume" min="0" max="3" value={audioObj.musicGainNode.gain.value} step="0.1"
        onInput={(e)=>{
          // console.log("doing stuff");
          const volume = e.currentTarget as HTMLInputElement;
          var musicGainNode = audioObj.musicGainNode;
          if(musicGainNode){
            musicGainNode.gain.value = Number(volume.value);
            // console.log("changed volume");
          }
          // console.log("ended stuff");
      }}/>🔊
    </>)
  }

  function UIVolumeInput(){
    const audioObj:AudioObj = (useContext(AudioSystemContext) as any) as AudioObj;
    if(audioObj.uiGainNode == undefined)return <></>;
    return (<>
      <input type="range" id="uivolume" min="0" max="3" value={audioObj.uiGainNode.gain.value} step="0.1"
        onInput={(e)=>{
          const uivolume = e.currentTarget as HTMLInputElement;
          const uiGainNode = audioObj.uiGainNode;
          if(uiGainNode){
            uiGainNode.gain.value = Number(uivolume.value);
          }
      }}/>UI🔊
    </>)
  }

  if(extrasToggled){
    return(<>
    <div id="extras-menu" className={styles.extrasMenu}>
    <a onClick={toggleExtras}
    style={{
      backgroundColor: "rgba(0, 16, 255, 0.5)",
      userSelect: "none",
      position: "absolute",
      right: "10px",
      top: "10px",
      padding: "10px",
      fontSize: "50px",
    }}>✖</a>
    <div className="musicplayer">
      <div className="musiccenter">
        <div className="musiccontrols">
          <div className="musiccontrols">
            <PlayPauseButton/>
            <span id="currentTime">
              {timeString}
              </span>-<span id="duration">
                {durationString}
              </span>
          </div>
            <MusicSeekInput/>
        </div>
        <div className="musicright">
          <MusicVolumeInput/>
        </div>
        <div className="musicright">
          <UIVolumeInput/>
        </div>
      </div>

      <div className="musicleft">
        <div id="trackName">
          <span>{trackName} by {author}</span>
          </div>
      </div>
    </div>
  </div>
  </>);
  }else{
    return <></>
  }
}