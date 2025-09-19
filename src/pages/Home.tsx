import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAudio } from '@/context/use-audio';
import type { Beat } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

import { useState, useEffect, useRef } from 'react';



const oneYearsAgoProject = {
  id: 'one-years-ago',
  title: 'À LA UNE',
  description: 'projet one years ago',
  coverImage: '/assets-optimized/project-cover.png',
  beats: [
    { id: 2, title: 'Inspiré de Big Scarr', image: '/assets-optimized/image/BIGSCARR-PNG.webp' },
    { id: 3, title: 'Inspiré de Key Glock', image: '/assets-optimized/image/KEYGLOCK-PNG.webp' },
    { id: 4, title: 'Inspiré de Chief Keef', image: '/assets-optimized/image/CHIEFKEEF-PNG.webp' },
  ],
};

const fetchProjectBeats = async (projectBeatsConfig: typeof oneYearsAgoProject.beats): Promise<Beat[]> => {
  const beatIds = projectBeatsConfig.map(b => b.id);

  const { data, error } = await supabase
    .from('beats')
    .select('*') // Select all fields, including cover_image_url and audio_file_url
    .in('id', beatIds);

  if (error) {
    throw new Error(error.message);
  }

  const processedBeats = data
    .map((beat: Beat) => {
      // Find the corresponding local config to potentially merge data or ensure order
      const localBeatConfig = projectBeatsConfig.find(b => b.id === beat.id);
      return {
        ...beat,
        // imageSrc should now come directly from beat.cover_image_url from Supabase
        // If localBeatConfig had specific overrides, they would go here,
        // but for now, we assume Supabase provides the correct URL.
        imageSrc: beat.cover_image_url, // Use the URL directly from Supabase
      };
    });
  return processedBeats;
};

const Home = () => {
  const { playPlaylist } = useAudio();

  const texts = ['BIBOYSKI', 'CAPTAIN DOOBIE', 'BROCO BOI', 'MIGOS', 'SALAZAR'];
  const [activeTexts, setActiveTexts] = useState<Array<{ id: number; text: string; x: number; y: number; }>>([]);
  const textIdCounter = useRef(0);

  useEffect(() => {
    const addTextInterval = setInterval(() => {
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      const newText = {
        id: textIdCounter.current++,
        text: randomText,
        x: 10 + Math.random() * 80, // From 10% to 90%
        y: 10 + Math.random() * 80, // From 10% to 90%
      };
      setActiveTexts((prev) => [...prev, newText]);

      // Remove text after a duration (e.g., 5 seconds)
      setTimeout(() => {
        setActiveTexts((prev) => prev.filter((t) => t.id !== newText.id));
      }, 5000);
    }, 1000); // Add a new text every 1 second

    return () => clearInterval(addTextInterval);
  }, []);

  const { data: projectBeats, isLoading, isError, error } = useQuery<Beat[], Error>({
    queryKey: ['oneYearsAgoBeats', oneYearsAgoProject.beats.map(b => b.title)],
    queryFn: () => fetchProjectBeats(oneYearsAgoProject.beats),
  });

  const handlePlayAlbum = async () => {
    if (projectBeats && projectBeats.length > 0) {
      const playlist = projectBeats.map(beat => ({
        ...beat,
        audioSrc: beat.audio_file_url,        imageSrc: beat.imageSrc || beat.cover_image_url, // Use the merged imageSrc
      }));
      playPlaylist(playlist, 0); // Play from the first track
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Randomly appearing/disappearing texts in the background */}
      {activeTexts.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute text-white font-metal text-3xl md:text-5xl lg:text-7xl whitespace-nowrap pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 0, // Ensure it's in the background
          }}
        >
          {item.text}
        </motion.div>
      ))}
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-metal text-5xl sm:text-6xl md:text-8xl text-primary text-glow mb-4 pulse-glow">
              241 PRODUCER
            </h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center my-2"
            >
              <div className="flex-grow border-t border-primary/30" />
              <span className="mx-6 font-metal text-2xl text-white tracking-widest">BY</span>
              <div className="flex-grow border-t border-primary/30" />
            </motion.div>

            <p className="font-metal text-2xl sm:text-3xl md:text-4xl text-primary/90 mb-8 tracking-wider">
              JYLSTHEPRODUCER
            </p>
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center"
          >
            <Link to="/beats">
              <Button 
                size="lg" 
                className="bg-gradient-fire hover:scale-105 transition-transform glow-red text-lg px-6 md:px-10 py-4"
              >
                <Music className="w-5 h-5 mr-2" />
                Explorer les Beats
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ONE YEARS AGO Project Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-metal text-3xl sm:text-4xl md:text-5xl text-primary text-glow mb-4">
              {oneYearsAgoProject.title}
            </h2>
            <p className="font-metal text-lg text-white max-w-2xl mx-auto">
              {oneYearsAgoProject.description}
            </p>
          </motion.div>

          {/* Album Cover with Fan Effect */}
          <div className="album-fan-container w-full max-w-md mx-auto aspect-square group">
            {/* Main Cover */}
            <img
              src={oneYearsAgoProject.coverImage}
              alt={oneYearsAgoProject.title}
              className="album-fan-main-cover"
            />

            {/* Fanned out Beat Covers */}
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <Loader className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <p className="absolute inset-0 flex items-center justify-center text-red-500 z-0">Erreur de chargement des beats.</p>
            ) : (
              projectBeats && projectBeats.map((beat, index) => (
                <img
                  key={beat.id}
                  src={beat.imageSrc || beat.cover_image_url || './placeholder.svg'}
                  alt={beat.title}
                  className="album-fan-beat-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:-translate-y-2 group-hover:z-20"
                />
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to={`/projects/${oneYearsAgoProject.id}`}>
                <Button
                  size="lg"
                  className="bg-gradient-fire hover:scale-105 transition-transform glow-red text-lg px-6 md:px-10 py-4"
                >
                  <Music className="w-5 h-5 mr-2" />
                  Découvrir l'album
                </Button>
              </Link>
              <Button
                size="lg"
                className="bg-gray-700 hover:bg-gray-800 transition-transform text-lg px-6 md:px-10 py-4"
                onClick={handlePlayAlbum}
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Écouter l'album
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-dark relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-metal text-2xl sm:text-3xl md:text-4xl text-primary text-glow mb-6">
              Prêt à Faire de la Musique ?
            </h2>
            <p className="font-metal text-lg text-white mb-8 max-w-2xl mx-auto">
              Connecte-toi avec 241 PRODUCER pour des beats sur mesure, des collaborations ou des licences. 
              Créons ensemble quelque chose de sombre et puissant.
            </p>
            <a href="https://wa.me/24176505254" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="bg-gradient-fire hover:scale-105 transition-transform glow-red text-lg px-8 py-3"
              >
                Prendre Contact
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
