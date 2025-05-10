import { useState, useEffect } from 'react';
import './App.css';

// Audio data with clip information
const drumPads = [
  {
    id: 'Heater-1',
    letter: 'Q',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
    name: 'Heater 1'
  },
  {
    id: 'Heater-2',
    letter: 'W',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
    name: 'Heater 2'
  },
  {
    id: 'Heater-3',
    letter: 'E',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
    name: 'Heater 3'
  },
  {
    id: 'Heater-4',
    letter: 'A',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
    name: 'Heater 4'
  },
  {
    id: 'Clap',
    letter: 'S',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
    name: 'Clap'
  },
  {
    id: 'Open-HH',
    letter: 'D',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
    name: 'Open-HH'
  },
  {
    id: 'Kick-n-Hat',
    letter: 'Z',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
    name: 'Kick-n\'-Hat'
  },
  {
    id: 'Kick',
    letter: 'X',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
    name: 'Kick'
  },
  {
    id: 'Closed-HH',
    letter: 'C',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
    name: 'Closed-HH'
  }
];

// Individual drum pad component
const DrumPad = ({ pad, playSound, isActive }) => {
  return (
    <div 
      id={pad.id} 
      className={`drum-pad ${isActive ? 'active' : ''}`}
      onClick={() => playSound(pad.letter)}
    >
      {pad.letter}
      <audio className="clip" id={pad.letter} src={pad.src}></audio>
    </div>
  );
};

// Toggle switch component
const ToggleSwitch = ({ isOn, toggle, label }) => {
  return (
    <div className="control-item">
      <div className="control-label">{label}</div>
      <div 
        className="control-toggle"
        onClick={toggle}
      >
        <div 
          className="toggle-indicator"
          style={{ marginLeft: isOn ? '25px' : '0' }}
        ></div>
      </div>
    </div>
  );
};

// Main Drum Machine component
function App() {
  const [displayText, setDisplayText] = useState('');
  const [activePad, setActivePad] = useState(null);
  const [power, setPower] = useState(true);
  const [bank, setBank] = useState(true);
  const [volume, setVolume] = useState(50);

  // Function to handle playing a sound
  const playSound = (letter) => {
    if (!power) return;
    
    const audio = document.getElementById(letter);
    if (audio) {
      audio.currentTime = 0;
      audio.volume = volume / 100;
      audio.play();
      
      // Find the corresponding drum pad to update display
      const pad = drumPads.find(pad => pad.letter === letter);
      setDisplayText(pad.name);
      
      // Add active state for visual feedback
      setActivePad(letter);
      setTimeout(() => setActivePad(null), 100);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!power) return;
      
      const key = e.key.toUpperCase();
      const pad = drumPads.find(pad => pad.letter === key);
      if (pad) {
        playSound(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [power, volume]);

  // Toggle power
  const togglePower = () => {
    setPower(!power);
    if (!power) {
      setDisplayText('Power ON');
    } else {
      setDisplayText('');
    }
  };

  // Toggle bank
  const toggleBank = () => {
    setBank(!bank);
    setDisplayText(bank ? 'Bank 2' : 'Bank 1');
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    if (!power) return;
    const newVolume = e.target.value;
    setVolume(newVolume);
    setDisplayText(`Volume: ${newVolume}`);
  };

  return (
    <div id="drum-machine">
      <div className="logo">FCC <span>🎧</span></div>
      
      <div className="drum-container">
        {/* Left side - Drum pads arranged like keyboard */}
        <div className="pad-container">
          {drumPads.map(pad => (
            <DrumPad 
              key={pad.id} 
              pad={pad} 
              playSound={playSound}
              isActive={activePad === pad.letter}
            />
          ))}
        </div>
        
        {/* Right side - Controls */}
        <div className="controls-container">
          {/* Power control */}
          <ToggleSwitch isOn={power} toggle={togglePower} label="Power" />
          
          {/* Display */}
          <div id="display">
            {displayText}
          </div>
          
          {/* Volume slider */}
          <div className="volume-slider">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              disabled={!power}
              className="slider"
            />
          </div>
          
          {/* Bank control */}
          <ToggleSwitch isOn={bank} toggle={toggleBank} label="Bank" />
        </div>
      </div>
    </div>
  );
}

export default App;