import { useAudio } from '@/context/use-audio';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, X, Volume2, Loader, Repeat, VolumeX, Maximize2, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

const GlobalAudioPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    duration, 
    currentTime, 
    seek, 
    isPlayerVisible, 
    hidePlayer, 
    volume, 
    setVolume, 
    isLoading, 
    isLooping, 
    toggleLoop, 
    toggleMute, 
    toggleFullScreen,
    playNext,
    playPrevious
  } = useAudio();

  if (!currentTrack || !isPlayerVisible) {
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
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-gradient-dark border-t-2 border-primary",
        isPlaying && "pulse-glow"
      )}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-grow">
            {currentTrack.imageSrc && (
              <img src={currentTrack.imageSrc} alt={currentTrack.title} className="w-12 h-12 rounded-md object-cover" />
            )}
            <div>
              <p className="font-metal text-lg text-foreground">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground">{currentTrack.author || ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoading && <Loader className="w-5 h-5 animate-spin text-primary" />}
            <Button
              onClick={toggleLoop}
              size="icon"
              variant="ghost"
              className={cn("text-muted-foreground hover:text-foreground", isLooping && "text-primary")}
            >
              <Repeat className="w-5 h-5" />
            </Button>
            <Button onClick={playPrevious} size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <SkipBack className="w-5 h-5" />
            </Button>
            <Button onClick={togglePlayPause} size="icon" className="bg-gradient-fire text-primary-foreground">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button onClick={playNext} size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-grow-0 flex-shrink-0 w-64 hidden md:block">
            <div className="text-sm text-muted-foreground flex justify-between mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div 
              className="w-full h-2 bg-muted/50 border border-muted rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-primary rounded-full absolute top-0 left-0 glow-red"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 hidden md:flex">
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

          <div className="flex items-center gap-2">
            <Button onClick={toggleFullScreen} size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Maximize2 className="w-5 h-5" />
            </Button>
            <Button onClick={hidePlayer} size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalAudioPlayer;