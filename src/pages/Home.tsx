import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAudio } from '@/context/use-audio';
import type { Beat } from '@shared/types';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';



const oneYearsAgoProject = {
  id: 'one-years-ago',
  title: 'Projet ONE YEARS AGO',
  description: 'Découvrez les productions phares de notre collection "ONE YEARS AGO".',
  coverImage: '/assets-optimized/project-cover.png',
  beats: [
    { title: 'Inspiré de Big Scarr', image: '/assets-optimized/image/BIGSCARR-PNG.webp' },
    { title: 'Inspiré de Key Glock', image: '/assets-optimized/image/KEYGLOCK-PNG.webp' },
    { title: 'Inspiré de Tchief Keef', image: '/assets-optimized/image/CHIEFKEEF-PNG.webp' },
  ],
};

const fetchProjectBeats = async (projectBeatsConfig: typeof oneYearsAgoProject.beats): Promise<Beat[]> => {
  const beatTitles = projectBeatsConfig.map(b => b.title);
  const res = await fetch(`/api/beats?limit=100`); 
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  return data.beats
    .filter((beat: Beat) => beatTitles.includes(beat.title))
    .map((beat: Beat) => {
      const localBeat = projectBeatsConfig.find(b => b.title === beat.title);
      return {
        ...beat,
        imageSrc: localBeat ? localBeat.image : beat.cover_image_url, // Use local image if available
      };
    });
};

const Home = () => {
  const { playPlaylist } = useAudio();

  const { data: projectBeats, isLoading, isError, error } = useQuery<Beat[], Error>({
    queryKey: ['oneYearsAgoBeats', oneYearsAgoProject.beats.map(b => b.title)],
    queryFn: () => fetchProjectBeats(oneYearsAgoProject.beats),
  });

  const handlePlayAlbum = async () => {
    if (projectBeats && projectBeats.length > 0) {
      const playlist = projectBeats.map(beat => ({
        ...beat,
        audioSrc: `${import.meta.env.VITE_API_URL}${beat.audio_file_url}`,
        imageSrc: beat.imageSrc || beat.cover_image_url, // Use the merged imageSrc
      }));
      playPlaylist(playlist, 0); // Play from the first track
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      
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
            <h1 className="font-metal text-6xl md:text-8xl text-primary text-glow mb-4 pulse-glow">
              241 PRODUCER
            </h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center my-2"
            >
              <div className="flex-grow border-t border-primary/30" />
              <span className="mx-6 font-metal text-2xl text-primary/90 tracking-widest">BY</span>
              <div className="flex-grow border-t border-primary/30" />
            </motion.div>

            <p className="font-metal text-3xl md:text-4xl text-primary/90 mb-8 tracking-wider">
              JYLSTHEPRODUCER
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              welcome to my crib , chaque semaine je drop 1 ou 2 TYPE S
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
                className="bg-gradient-fire hover:scale-105 transition-transform glow-red text-lg px-10 py-4"
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
            <h2 className="font-metal text-4xl md:text-5xl text-primary text-glow mb-4">
              {oneYearsAgoProject.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
            <Link to={`/projects/${oneYearsAgoProject.id}`}>
              <Button
                size="lg"
                className="bg-gradient-fire hover:scale-105 transition-transform glow-red text-lg px-10 py-4"
              >
                <Music className="w-5 h-5 mr-2" />
                Découvrir l'album
              </Button>
            </Link>
            <Button
              size="lg"
              className="ml-4 bg-gray-700 hover:bg-gray-800 transition-transform text-lg px-10 py-4"
              onClick={handlePlayAlbum}
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Écouter l'album
            </Button>
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
            <h2 className="font-metal text-3xl md:text-4xl text-primary text-glow mb-6">
              Prêt à Faire de la Musique ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connecte-toi avec 241 PRODUCER pour des beats sur mesure, des collaborations ou des licences. 
              Créons ensemble quelque chose de sombre et puissant.
            </p>
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-gradient-fire hover:scale-105 transition-transform glow-red text-lg px-8 py-3"
              >
                Prendre Contact
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;