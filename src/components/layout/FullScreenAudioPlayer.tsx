import React from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/context/use-audio';
import { X, Play, Pause, Volume2, VolumeX, Repeat, Loader, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FullScreenAudioPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    duration, 
    currentTime, 
    seek, 
    volume, 
    setVolume, 
    isLoading, 
    isLooping, 
    toggleLoop, 
    toggleMute, 
    isFullScreen, 
    toggleFullScreen,
    playNext,
    playPrevious,
    playlist,
    currentTrackIndex,
    playPlaylist
  } = useAudio();

  if (!isFullScreen || !currentTrack) {
    return null;
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const width = progressBar.offsetWidth;
    const time = (clickX / width) * duration;
    seek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: `url(${currentTrack.imageSrc || './placeholder.svg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for blur and darkness */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl"></div>

      <Button
        onClick={toggleFullScreen}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-muted-foreground hover:text-primary z-20"
      >
        <X className="w-6 h-6" />
      </Button>

      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between gap-8 lg:gap-12 max-w-6xl mx-auto p-4">
        {/* Main Player Section (Left/Center) */}
        <div className="flex flex-col items-center justify-center flex-grow gap-4 max-w-sm lg:max-w-md">
          {/* Album Art */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-lg shadow-lg overflow-hidden metal-border">
              <img 
                  src={currentTrack.imageSrc || './placeholder.svg'} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover object-top" 
              />
          </div>

          {/* Track Info */}
          <div className="text-center mt-2">
            <h2 className="font-metal text-2xl md:text-3xl text-foreground tracking-wider">{currentTrack.title}</h2>
            <p className="text-base text-muted-foreground">{currentTrack.author}</p>
          </div>

          {/* Seek Bar */}
          <div className="w-full">
              <div 
                className="w-full h-2 bg-muted/50 border border-muted rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-primary rounded-full absolute top-0 left-0 glow-red"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground flex justify-between mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4 w-full">
              <Button onClick={playPrevious} size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <SkipBack className="w-8 h-8" />
              </Button>
              {isLoading ? (
                  <Loader className="w-14 h-14 animate-spin text-primary" />
              ) : (
                  <Button onClick={togglePlayPause} size="icon" className="w-16 h-16 rounded-full bg-gradient-fire text-primary-foreground shadow-lg">
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
              )}
              <Button onClick={playNext} size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <SkipForward className="w-8 h-8" />
              </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between w-full mt-2">
              <Button
                onClick={toggleLoop}
                size="icon"
                variant="ghost"
                className={cn("text-muted-foreground hover:text-foreground", isLooping && "text-primary")}
              >
                <Repeat className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2">
                  <Button onClick={toggleMute} size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                  {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-2 bg-muted-foreground rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none"
                  />
              </div>
          </div>

        </div>

        {/* Playlist Section (Right) */}
        <div className="w-full lg:w-1/3 h-full bg-black/50 rounded-lg p-4 overflow-y-auto">
            <h3 className="font-metal text-xl text-primary mb-4">Playlist en cours</h3>
            <div className="space-y-3">
                {playlist.map((track, index) => (
                    <div 
                        key={track.id} 
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
                            index === currentTrackIndex ? "bg-primary/20 text-primary" : "hover:bg-white/10 text-foreground"
                        )}
                        onClick={() => playPlaylist(playlist, index)}
                    >
                        <img 
                            src={track.imageSrc || './placeholder.svg'} 
                            alt={track.title} 
                            className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                            <p className="text-sm font-semibold">{track.title}</p>
                            <p className="text-xs text-muted-foreground">{track.author}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </motion.div>
  );
};

export { FullScreenAudioPlayer };
