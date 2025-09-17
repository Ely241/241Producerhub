import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API_BASE_URL from '@/lib/api-client';

interface BeatCardProps {
  id: number;
  title: string;
  genre: string;
  duration: string;
  price?: string;
  tags?: string[];
  imageSrc?: string;
  author?: string;
  likes: number;
  onPlay: () => void; // Expect an onPlay prop
}

const BeatCard = (beat: BeatCardProps) => {
  const { id, title, genre, duration, price, tags = [], imageSrc, author, likes, onPlay } = beat;
  const queryClient = useQueryClient();

  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const likedBeats = JSON.parse(localStorage.getItem('likedBeats') || '{}');
    if (likedBeats[id]) {
      setIsLiked(true);
    }
  }, [id]);

  const likeMutation = useMutation({
    mutationFn: () => fetch(`${API_BASE_URL}/api/beats/${id}/like`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beats'] });
    },
  });

  const handlePlay = () => {
    if (onPlay) {
      onPlay(); // Call the passed onPlay function
    }
  };

  const handleLike = () => {
    if (isLiked) return;
    setLikeCount(likeCount + 1);
    setIsLiked(true);
    const likedBeats = JSON.parse(localStorage.getItem('likedBeats') || '{}');
    likedBeats[id] = true;
    localStorage.setItem('likedBeats', JSON.stringify(likedBeats));
    likeMutation.mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group">
        {imageSrc && (
          <div className="aspect-video overflow-hidden relative">
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button onClick={handlePlay} size="icon" className="w-16 h-16 bg-card/70 backdrop-blur-sm hover:bg-card">
                <PlayCircle className="w-12 h-12 text-primary" />
              </Button>
            </div>
          </div>
        )}
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-metal text-xl text-primary group-hover:text-glow transition-all duration-300">
                {title}
              </h3>
              {author && <p className="text-sm text-muted-foreground">par {author}</p>}
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <span>{genre}</span>
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

          <div className="flex items-center gap-4 mt-4">
            {!imageSrc && (
                <Button onClick={handlePlay} className="flex-grow">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Écouter
                </Button>
            )}
            <Button onClick={handleLike} variant="outline" className="flex items-center gap-2 group/like">
                <motion.div
                    key={isLiked ? "liked" : "unliked"} // Key to re-trigger animation on state change
                    initial={{ scale: 1 }}
                    animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }} // Bounce effect when liked
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                    whileTap={{ scale: 0.9 }} // Shrink on tap
                >
                    <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-muted-foreground group-hover/like:text-primary'}`} />
                </motion.div>
                <span className="text-muted-foreground group-hover/like:text-primary transition-colors">{likeCount}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BeatCard;
