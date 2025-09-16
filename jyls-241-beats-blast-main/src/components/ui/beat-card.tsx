import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AudioPlayer from './audio-player';
import { motion } from 'framer-motion';

interface BeatCardProps {
  title: string;
  genre: string;
  bpm: number;
  duration: string;
  audioSrc: string;
  price?: string;
  tags?: string[];
}

const BeatCard = ({ title, genre, bpm, duration, audioSrc, price, tags = [] }: BeatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-metal text-xl text-primary group-hover:text-glow transition-all duration-300">
                {title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <span>{genre}</span>
                <span>•</span>
                <span>{bpm} BPM</span>
                <span>•</span>
                <span>{duration}</span>
              </div>
            </div>
            {price && (
              <Badge variant="secondary" className="bg-gradient-fire text-primary-foreground font-bold">
                {price}
              </Badge>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs border-border hover:border-primary/50 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Audio Player */}
          <AudioPlayer 
            src={audioSrc} 
            title={title}
            className="bg-muted/50 border-border/50"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BeatCard;