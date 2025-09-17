import React from 'react';
import { useAudio } from '@/context/use-audio';
import GlobalAudioPlayer from './GlobalAudioPlayer';
import { FullScreenAudioPlayer } from './FullScreenAudioPlayer';

const AudioPlayerContainer = () => {
  const { isPlayerVisible, isFullScreen } = useAudio();

  if (!isPlayerVisible) {
    return null;
  }

  return (
    <React.Fragment>
      <GlobalAudioPlayer />
      {isFullScreen && <FullScreenAudioPlayer />}
    </React.Fragment>
  );
};

export default AudioPlayerContainer;
