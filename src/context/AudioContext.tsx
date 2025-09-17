import React, { useContext, useState, useRef, ReactNode, useCallback, useEffect } from 'react';
import { Track, AudioContextType, AudioContext } from './audio-context-definition';

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const preloadAudioRef = useRef<HTMLAudioElement>(null); // New ref for preloading
  const prevVolume = useRef(1);

  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  const playNext = useCallback(() => {
    if (playlist.length === 0 || currentTrackIndex === null) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
  }, [currentTrackIndex, playlist.length]);

  const playPrevious = () => {
    if (playlist.length === 0 || currentTrackIndex === null) return;
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
  };

  const toggleLoop = () => {
    setIsLooping(prev => !prev);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (audioRef.current.volume > 0) {
        prevVolume.current = audioRef.current.volume;
        setVolume(0);
      } else {
        setVolume(prevVolume.current > 0 ? prevVolume.current : 1);
      }
    }
  };

  const playPlaylist = (tracks: Track[], startIndex = 0) => {
    setPlaylist(tracks);
    setCurrentTrackIndex(startIndex);
    setIsPlaying(true);
    setIsPlayerVisible(true);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const hidePlayer = () => {
    setIsPlayerVisible(false);
    setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const onEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      playNext();
    }
  };

  useEffect(() => {
    if (currentTrackIndex !== null && playlist.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      const nextTrack = playlist[nextIndex];

      if (preloadAudioRef.current && nextTrack && nextTrack.audioSrc) {
        preloadAudioRef.current.src = nextTrack.audioSrc;
        preloadAudioRef.current.load(); // Start loading the next track
        console.log('Preloading next track:', nextTrack.title);
      }
    }
  }, [currentTrackIndex, playlist]); // Re-run when current track changes or playlist updates

  return (
    <AudioContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      duration, 
      currentTime, 
      playPlaylist, 
      togglePlayPause, 
      seek, 
      isPlayerVisible, 
      hidePlayer, 
      isFullScreen, 
      toggleFullScreen, 
      volume, 
      setVolume, 
      isLoading, 
      isLooping, 
      toggleLoop, 
      toggleMute,
      playNext, 
      playPrevious,
      playlist, // Added
      currentTrackIndex // Added
    }}>
      {children}
      <audio 
        ref={audioRef} 
        src={currentTrack?.audioSrc} 
        onPlay={() => {
          setIsPlaying(true);
          setIsLoading(false);
        }} 
        onPause={() => setIsPlaying(false)}
        onEnded={onEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlayThrough={() => setIsLoading(false)}
        autoPlay
      />
      {/* Hidden audio element for preloading */}
      <audio ref={preloadAudioRef} style={{ display: 'none' }} />
    </AudioContext.Provider>
  );
};
