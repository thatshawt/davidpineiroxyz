import styles from './music.module.css';
import { Page } from "../components/Page";
import { useContext } from 'react';
import { AudioSystemContext, type AudioObj } from '../components/AudioSystem';

export default function MusicLibraryPage(){
    const audioObj:AudioObj = useContext(AudioSystemContext);

    // console.log(audioObj);
    
    return (
    <Page title="Music Library">
        <h1>Music Library</h1>

        <div id="music-container">
            <ul>
                {[...audioObj.tracks.entries()].map(([trackid, track]) => (
                <li key={trackid}
                    className={styles.trackElem}
                    onClick={(e)=>{
                        audioObj.loadMusicTrack(trackid);
                        audioObj.playAudioBuffName("uisound_min9");
                    }}
                >
                    <img src={track.artwork} />
                    <span>{track.title} by {track.artist}</span>
                </li>
                ))}
            </ul>
        </div>
    </Page>);
}