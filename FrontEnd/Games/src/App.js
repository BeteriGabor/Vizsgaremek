import React, { useRef, useState } from "react";
import "./App.css";
import YouTube from "react-youtube";

function App() {
  const playerRef = useRef(null);
  const [volume, setVolume] = useState(50);
  const [musicStarted, setMusicStarted] = useState(false);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const startMusic = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      setMusicStarted(true);
    }
  };

  const opts = {
    height: "0", 
    width: "0",
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      listType: "playlist",
      list: "PL7VmbB9FbugIa9D5jQSOkvnLgOmcTnA2v",
    },
  };

  return (
    <>


      <YouTube videoId="qz0CzhZ_eI8" opts={opts} onReady={onPlayerReady} />

      <iframe
        src="http://localhost:3000"
        frameBorder="0"
        className="w-screen h-screen"
        title="Content"
      ></iframe>
      <div className="absolute bottom-2 left-1rounded-lg px-2  items-center">
        {!musicStarted ? (
          <button
            onClick={startMusic}
            className="hover:scale-150 "
          >
            <img src="/emoji/sound.png" alt="🔊" className="w-8 h-8 mx-auto" />
          </button>
        ) : (
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-40"
          />
        )}
      </div>
    </>
  );
}

export default App;
