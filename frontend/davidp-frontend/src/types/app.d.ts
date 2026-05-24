import type { AudioObj } from "../App";

export {};

declare global {
  interface Window {
    turnstile: any;
    tippy: any;
    hehe?: () => void;
    audioObj: AudioObj;
    _audioLoaded:boolean|undefined;
  }
}