import React from 'react';

export interface Track {
  title: string;
  audioSrc: string;
  imageSrc?: string;
}

export interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  isPlayerVisible: boolean;
  hidePlayer: () => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isLoading: boolean;
  isLooping: boolean;
  toggleLoop: () => void;
  toggleMute: () => void;
}

export const AudioContext = React.createContext<AudioContextType | undefined>(undefined);
