import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Replay } from 'vimond-replay';
import 'vimond-replay/index.css';
import { cuts } from './cuts';

const App = () => {
  // Global / system clock refs
  const systemStartTimeRef = useRef(0);
  const systemTimeRef = useRef(0);

  // Cut Countdown Clock (ccc) refs
  const currentCutIndexRef = useRef(0);
  const currentCutDurationRef = useRef(0);
  const cccTimeRef = useRef(0);
  const cccStartTimeRef = useRef(0);
  const cccRunningRef = useRef(false);
  const cccIntervalRef = useRef(null);

  // Video preview refs
  const videoActions = useRef(null);
  const setVideoProperties = useRef(null);

  // UI states
  const [time, setTime] = useState(0);
  const [cccTimeRemaining, setCccTimeRemaining] = useState(0);

  const framesPerSecond = 30;
  const skip = 30;

  const setVideoTime = (newTime) => {
    videoActions.current.setPosition(newTime);
  };

  function pause() {
    if (videoActions.current) {
      videoActions.current.pause();
    }
  }

  function play() {
    if (videoActions.current) {
      videoActions.current.play();
    }
  }

  function stopCCC() {
    if (cccRunningRef.current) {
      console.log('Clearing interval');
      clearInterval(cccIntervalRef.current);
      cccIntervalRef.current = null;
      cccRunningRef.current = false;
      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

      pause();
    }
  }

  function onFrameCCC() {
    if (cccRunningRef.current) {
      cccTimeRef.current = performance.now() * 0.001 - cccStartTimeRef.current;
      systemTimeRef.current =
        performance.now() * 0.001 - systemStartTimeRef.current;
      setTime(systemTimeRef.current.toFixed(2));

      // Has cut finished
      if (cccTimeRef.current >= currentCutDurationRef.current.toFixed(4)) {
        // console.log('CCC: ', cccTimeRef.current);
        // console.log('Duration: ', currentCutDurationRef.current.toFixed(4));
        console.log(
          'Diff: ',
          (cccTimeRef.current - currentCutDurationRef.current).toFixed(4)
        );

        cccStartTimeRef.current = performance.now() * 0.001;
        cccTimeRef.current = 0;

        // Is this the last cut
        if (currentCutIndexRef.current + 1 >= cuts.length) {
          stopCCC();
        } else {
          currentCutIndexRef.current += 1;
          const currentCut = cuts[currentCutIndexRef.current];
          currentCutDurationRef.current = currentCut.end - currentCut.start;
          setVideoTime(currentCut.start);

          console.log(currentCut);
        }
      }

      setCccTimeRemaining(
        (currentCutDurationRef.current - cccTimeRef.current).toFixed(2)
      );
    }
  }

  function startCCC() {
    stopCCC();

    if (!cccRunningRef.current) {
      cccRunningRef.current = true;

      cccTimeRef.current = 0;
      cccStartTimeRef.current = performance.now() * 0.001;
      systemStartTimeRef.current = performance.now() * 0.001;

      currentCutIndexRef.current = 0;
      const currentCut = cuts[0];
      currentCutDurationRef.current = currentCut.end - currentCut.start;

      setTime(0);
      setCccTimeRemaining(currentCutDurationRef.current.toFixed(2));
      setVideoTime(currentCut.start);

      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log(currentCut);

      play();

      cccIntervalRef.current = setInterval(
        onFrameCCC,
        Math.floor(1000 / framesPerSecond)
      );
    }
  }

  const playbackActionsReady = ({ setPlaybackProperties, ...actions }) => {
    videoActions.current = actions;
    setVideoProperties.current = setPlaybackProperties;
  };

  const handleStreamStateChange = (stateProperties) => {
    if (stateProperties) {
      if ('position' in stateProperties) {
        // console.log(
        // 	'Stream observation example: Playback position is ' +
        // 		stateProperties.position.toFixed(1),
        // );
      }
      if (stateProperties.isPaused) {
        console.log('Stream observation example: The playback was paused.');
      }
      if (stateProperties.isPaused === false) {
        console.log('Stream observation example: The playback was resumed.');
      }
      if (stateProperties.playState === 'inactive') {
        console.log('Stream observation example: The playback has ended.');
      }
    }
  };

  const mute = () => {
    if (setVideoProperties) {
      setVideoProperties({ isMuted: true });
    }
  };

  const unmute = () => {
    if (setVideoProperties) {
      setVideoProperties({ isMuted: false });
    }
  };

  const forward = () => {
    setVideoTime(systemTimeRef.current + skip * 60);
  };

  const back = () => {
    setVideoTime(systemTimeRef.current - skip * 60);
  };

  return (
    <div className="main">
      <div className="video-container">
        <Replay
          source="http://localhost:5003/video"
          options={{
            controls: {
              // includeControls: [],
              includeControls: [
                'playPauseButton',
                'timeline',
                'timeDisplay',
                'volume',
                'fullscreenButton',
              ],
            },
          }}
          initialPlaybackProps={{ isPaused: true, isMuted: false }}
          onStreamStateChange={handleStreamStateChange}
          onPlaybackActionsReady={playbackActionsReady}
        />
      </div>
      <div className="controls-container">
        <div className="timers-container">
          <div className="timer">{time}</div>
          <div className="timer">{cccTimeRemaining}</div>
        </div>
        <div className="buttons-container">
          <button type="button" onClick={startCCC}>
            Start
          </button>
          <button type="button" onClick={stopCCC}>
            Stop
          </button>
        </div>
        <div className="buttons-container">
          <button type="button" onClick={play}>
            Play
          </button>
          <button type="button" onClick={pause}>
            Pause
          </button>
          <button
            type="button"
            onClick={forward}
          >{`Forward ${skip} mins`}</button>
          <button type="button" onClick={back}>{`Back ${skip} mins`}</button>
          <button type="button" onClick={mute}>
            Mute
          </button>
          <button type="button" onClick={unmute}>
            Unmute
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
