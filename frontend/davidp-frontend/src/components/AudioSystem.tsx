// @ts-nocheck
import { createContext, useState, useEffect } from "react";

export type MusicTrack = {
  url:string;

  title:string;
  artist:string;
  album:string;
  artwork:string;
};

export type AudioObj = {
  context: AudioContext;

  elements: undefined;

  tracks: Map<string,MusicTrack>|undefined;
  buffers: Map<string,AudioBuffer>|undefined;

  trackAudioId: string|undefined;

  uiGainNode: GainNode|undefined;
  musicGainNode: GainNode|undefined;

  musicSourceNode: MediaElementAudioSourceNode|undefined;
  musicAudioEl: HTMLAudioElement|undefined;

  currentTrack: MusicTrack|undefined;

  currentTimeString: string|undefined;
  currentTimeSeek: string|undefined;
  currentTimeDuration: string|undefined;

  _setMetadata: (track:MusicTrack) => void;

  _updateMetadata: () => void;

  registerMusicTrack: (name:string, track:MusicTrack) => void;

  _loadMusicTrackEl: (name:string) => void;

  loadMusicTrack: (name) => Promise<void>;

  setAudioBuffNameUrl: (name:string, url:string) => Promise<void>;

  playMusicCurrentTrack: () => void;

  playAudioBuffName: (name:string) => void;
};

export const AudioSystemContext = createContext(undefined);

export function AudioSystem({children}){
  var [audioObj, setAudioObj] = useState({
      context: new AudioContext(),
      elements: undefined,
      tracks: new Map(),
      buffers: new Map(),

      trackAudioId: "musicTrack",

      uiGainNode: undefined,
      musicGainNode: undefined,

      musicSourceNode: undefined,
      musicAudioEl: undefined,

      currentTrack: {},

      currentTimeString: "0:00",
      currentTimeSeek: "0:00",
      currentTimeDuration: "0:00",

      _setMetadata: (newTrack) => {
        if(audioObj.currentTrack == newTrack)return;

        audioObj.currentTrack = newTrack;
        const track = newTrack;
        
        const trackNameEl = document.getElementById('trackName');
        if(trackNameEl)trackNameEl.innerHTML = `<span style='background-color:#fffb0047;'>${track.title}</span> by <span style='background-color:#ff000070;'>${track.artist}</span>`;
        
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: track.album,
          artwork: [
            {
              src: track.artwork,
            },
          ],
        });
        updateAudioObjState();
      },

      _updateMetadata: () => {
        const audio = audioObj.musicAudioEl;
        if(audio && isFinite(audio.duration)){
          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate,
            position: audio.currentTime,
          });
          navigator.mediaSession.playbackState = audio.paused ? 'paused' : 'playing';
          // console.log("updated metadata?", navigator.mediaSession);
        }else{
          navigator.mediaSession.setPositionState({});
          navigator.mediaSession.playbackState = null;
        }
      },

      registerMusicTrack: (name, trackdata) => {
        audioObj.tracks.set(name,{
          title: trackdata.title,
          artist: trackdata.artist,
          album: trackdata.album,
          artwork: trackdata.artwork,
          url: trackdata.url
        });
        
        updateAudioObjState();
      },

      _loadMusicTrackEl: (name) => {
        const newTrack:MusicTrack = audioObj.tracks.get(name);
        // console.log("track",track,audioObj);
        if(!newTrack || newTrack == audioObj.currentTrack)return;

        const track = newTrack;
        audioObj.currentTrack = track;
        updateAudioObjState();

        audioObj._setMetadata(track);

        audioObj.musicAudioEl = document.getElementById(audioObj.trackAudioId) as HTMLAudioElement;

        updateAudioObjState();
      },

      loadMusicTrack: async (name) => {
        // console.log("load", name);
        // console.log(audioObj)
        audioObj._loadMusicTrackEl(name);
        // console.log(audioObj, name);

        const id = audioObj.trackAudioId;

        var audioCtx = audioObj.context;
        if(audioObj.musicSourceNode){
          audioObj.musicSourceNode.disconnect();
          audioObj.musicSourceNode = null;
          
          audioObj.musicGainNode.connect(audioCtx.destination);
        }

        var myAudio = document.querySelector("#" + id) as HTMLAudioElement;
        audioObj.musicAudioEl = myAudio;

        // console.log(myAudio);

        var source = audioCtx.createMediaElementSource(myAudio);
        source.connect(audioObj.musicGainNode);
        audioObj.musicSourceNode = source;

        // console.log("played audio?", myAudio);
        audioObj._updateMetadata();

        updateAudioObjState();
      },

      playMusicCurrentTrack: () => {
        const audio = audioObj.musicAudioEl;
        if(audio){
          audio.play();
          // updatePlayPauseButton();
          audioObj._updateMetadata();
        }
      },

      setAudioBuffNameUrl: async (name:string, url:string) => {
        const context = audioObj.context;
        try {
          const response = await fetch(url);
          audioObj.buffers.set(name,await context.decodeAudioData(await response.arrayBuffer()));
          updateAudioObjState();
        } catch (err) {
          console.error(`Unable to fetch the audio file. Error: ${err.message}`);
        }
      },

      playAudioBuffName: (name) => {
        if(!audioObj)return;
        const context = audioObj.context;
        // Check if context is in suspended state (autoplay policy)
        if (context.state === "suspended") {
          context.resume();
        }
        if (context.state === "interrupted") {
          // context.resume().then(() => audioObj.playAudioBuffName(name));
          return;
        }

        const buffer = audioObj.buffers.get(name);
        if(buffer){
          let source = context.createBufferSource();
          source.buffer = buffer;
          source.connect(audioObj.uiGainNode);
          source.loop = false;
          source.start();
        }
      },
    } as AudioObj);

  function updateAudioObjState(){
    const {...newAudioObj} = audioObj; // make new object so it updates properly
    setAudioObj((_oldAudioObj)=>newAudioObj);
    window.audioObj = audioObj;//TODO remove window.audioObj
  }

  function initialLoad(){
    window._audioLoaded = true;

    var ctx = audioObj.context;
    // console.log("audioObj", audioObj);
    audioObj.uiGainNode = ctx.createGain();
    audioObj.musicGainNode = ctx.createGain();

    audioObj.uiGainNode.connect(ctx.destination);
    audioObj.musicGainNode.connect(ctx.destination);

    updateAudioObjState();

    // 		LICENSE FOR UI SOUNDS
    // Universal UI Soundpack

    // Created and distributed by Nathan Gibson (https://nathangibson.myportfolio.com)
    // Creation date: 27/9/2021

    // License: Attribution 4.0 International (CC BY 4.0)
    // https://creativecommons.org/licenses/by/4.0/

    // Support me by crediting Nathan Gibson or https://nathangibson.myportfolio.com

    audioObj.setAudioBuffNameUrl("uisound_min3", "/static/sounds/ui/Minimalist3.ogg");
    audioObj.setAudioBuffNameUrl("uisound_min9", "/static/sounds/ui/Minimalist9.ogg");
    audioObj.setAudioBuffNameUrl("uisound_min11", "/static/sounds/ui/Minimalist11.ogg");
    audioObj.setAudioBuffNameUrl("uisound_min12", "/static/sounds/ui/Minimalist12.ogg");

    audioObj.registerMusicTrack("dog", {
      title:"Devil's Trill Sonata",
      artist:"Ray Chen and Amsterdam Sinfonietta",
      album:"",
      artwork:"/static/media/devilTrill.jpg",
      url:"https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d1/Giuseppe_Tartini-_Devil%27s_Trill_Sonata_-_Ray_Chen_and_Amsterdam_Sinfonietta_-_Live_Concert_HD.webm/Giuseppe_Tartini-_Devil%27s_Trill_Sonata_-_Ray_Chen_and_Amsterdam_Sinfonietta_-_Live_Concert_HD.webm.240p.vp9.webm?download",
    });

    audioObj.registerMusicTrack("brownoise1", {
      title:"Soft Brown Noise",
      artist:"Cosmic Scapes",
      album:"",
      artwork:"/static/media/brownnoise.jpg",
      url:"/static/sounds/cosmic-scapes-soft-brown-noise-299934.ogg",
    });

    updateAudioObjState();

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => {
        const audio = audioObj.musicAudioEl;
        if(audio){
          audio.play();
          audioObj._updateMetadata();
        }
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        const audio = audioObj.musicAudioEl;
        if(audio){
          audio.pause();
          audioObj._updateMetadata();
        }
      });
      navigator.mediaSession.setActionHandler("stop", () => {
        const audio = audioObj.musicAudioEl;
        if(audio){
          audio.pause();
          audioObj._updateMetadata();
        }
      });
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        const audio = audioObj.musicAudioEl;
        if(audio){
          audio.currentTime = Math.max(0, audio.currentTime - 10);
          audioObj._updateMetadata();
        }
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        const audio = audioObj.musicAudioEl;
        if(audio){
          audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
          audioObj._updateMetadata();
        }
      });
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        const audio = audioObj.musicAudioEl;

        if (!audio || isNaN(audio.duration)) return;

        let time = details.seekTime;

        // Clamp to valid range
        time = Math.max(0, Math.min(audio.duration, time));

        // Use fastSeek if supported (better performance on some browsers)
        if (details.fastSeek && typeof audio.fastSeek === "function") {
          audio.fastSeek(time);
        } else {
          audio.currentTime = time;
        }
        audioObj._updateMetadata();
      });
      // navigator.mediaSession.setActionHandler("previoustrack", () => {
      // 	/* Code excerpted. */
      // });
      // navigator.mediaSession.setActionHandler("nexttrack", () => {
      // 	/* Code excerpted. */
      // });
    }

    setInterval(() => {
      audioObj._updateMetadata();
      // updatePlayPauseButton();
    }, 1000);

    audioObj.loadMusicTrack("dog");

    // console.log("set metadata");
    updateAudioObjState();
  }

  useEffect(()=>{
    if(!window._audioLoaded)initialLoad();

  },[]);

  return <AudioSystemContext.Provider value={audioObj}>
      {<audio
        id={audioObj.trackAudioId}
        loop={true}
        crossOrigin='anonymous'
        src={(audioObj && audioObj.currentTrack) ? (audioObj.currentTrack.url) : undefined}
        onTimeUpdate={(e) => {
          // const audio = audioObj.musicAudioEl;
          const audio = e.currentTarget;
          audioObj.currentTimeSeek = ((audio.currentTime / audio.duration) * 100).toString() || "0";
          audioObj.currentTimeString = formatTime(audio.currentTime);
          audioObj.currentTimeDuration = formatTime(audio.duration);
          updateAudioObjState();
          // console.log("updated?");
        }}
        onLoadedMetadata={(e)=>{
          // const audio = audioObj.musicAudioEl;
          const audio = e.currentTarget;
          audioObj.currentTimeDuration = formatTime(audio.duration);
          // console.log("loaded",audioObj.currentTimeDuration);
          updateAudioObjState();
        }}
      />}
      {children}
    </AudioSystemContext.Provider>
}

// Helper
function formatTime(sec) {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function injectSoundFuncCallIntoElementAttr(element, attr, soundName)
{
  const orig = element[attr];
  if(orig == null){
    element[attr] = () => {window.audioObj.playAudioBuffName(soundName);};
  }else{
    const newFunc = () => {
      window.audioObj.playAudioBuffName(soundName);
      orig();
    };
    element[attr] = newFunc;
  }
}

export function setupSoundsFX(){
  document.querySelectorAll("a").forEach(element => {
    // console.log(element);
    injectSoundFuncCallIntoElementAttr(element, "onmouseover", "uisound_min3");
  });

  document.querySelectorAll("a[href]").forEach(element => {
    // console.log(element);
    injectSoundFuncCallIntoElementAttr(element, "onclick", "uisound_min12");
  });

  document.querySelectorAll("button").forEach(element => {
    // console.log(element);
    injectSoundFuncCallIntoElementAttr(element, "onclick", "uisound_min9");
  });
}

export function setupSoundsFXDynamic(){
  document.querySelectorAll("div.section a").forEach(element => {
    // console.log(element);
    injectSoundFuncCallIntoElementAttr(element, "onmouseover", "uisound_min3");
  });

  document.querySelectorAll("div.section a[href]").forEach(element => {
    // console.log(element);
    injectSoundFuncCallIntoElementAttr(element, "onclick", "uisound_min12");
  });

  document.querySelectorAll("div.section button").forEach(element => {
    // console.log(element);
    injectSoundFuncCallIntoElementAttr(element, "onclick", "uisound_min9");
  });
}