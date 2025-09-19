import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BeatCard from '@/components/ui/beat-card';
import ParticleBackground from '@/components/layout/ParticleBackground';
import { useQuery } from '@tanstack/react-query';
import type { Beat } from '@shared/types';
import { useAudio } from '@/context/use-audio';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';


interface ProjectData {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  beatTitles: string[];
}

const projectsData: ProjectData[] = [
  {
    id: 'one-years-ago',
    title: 'Projet ONE YEARS AGO',
    description: "Ces beats datent d'il y a un an, marquant mes débuts.",
    coverImage: '/assets-optimized/project-cover.png',
    beatTitles: [
      'Inspiré de Big Scarr',
      'Inspiré de Key Glock',
      'Inspiré de Chief Keef',
    ],
  },
  // Add more projects here as needed
];

// Function to fetch all beats needed for all projects
const fetchAllProjectBeats = async (allBeatTitles: string[]): Promise<Beat[]> => {
  const { data, error } = await supabase
    .from('beats')
    .select('*') // Select all fields, including cover_image_url and audio_file_url
    .in('title', allBeatTitles);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const Projects = () => {
  const { playPlaylist } = useAudio();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    if (projectId) {
      const project = projectsData.find(p => p.id === projectId);
      setSelectedProject(project || null);
    } else {
      setSelectedProject(null);
    }
  }, [projectId]);

  const allBeatTitles = projectsData.flatMap(project => project.beatTitles);

  const { data: allBeats, isLoading, isError, error } = useQuery<Beat[], Error>({
    queryKey: ['allProjectBeats', allBeatTitles],
    queryFn: () => fetchAllProjectBeats(allBeatTitles),
  });

  const handlePlay = (beatsToPlay: Beat[], startIndex: number) => {
    if (beatsToPlay) {
      const playlist = beatsToPlay.map(beat => ({
        ...beat,
        audioSrc: beat.audio_file_url,
      }));
      playPlaylist(playlist, startIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 relative flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center text-foreground">
          <Loader className="w-10 h-10 animate-spin mx-auto mb-4" />
          <p>Chargement des projets...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-16 relative flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center text-red-500">
          <p>Erreur lors du chargement des projets: {error?.message}</p>
        </div>
      </div>
    );
  }

  if (selectedProject) {
    // Project Detail View
    const projectBeats = allBeats?.filter(beat => selectedProject.beatTitles.includes(beat.title)) || [];
    const albumArtist = "JYLSTHEPRODUCER"; // Hardcoded for now

    

    return (
      <div className="min-h-screen pt-16 relative">
        <ParticleBackground />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <Button onClick={() => navigate('/projects')} variant="ghost" className="text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour aux projets
          </Button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            {/* Album Cover */}
            <motion.img
              src={selectedProject.coverImage}
              alt={selectedProject.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-xs md:max-w-sm rounded-lg shadow-lg metal-border object-cover object-top"
            />
            {/* Project Info */}
            <div className="text-center md:text-left flex-grow">
              <h1 className="font-metal text-4xl md:text-5xl text-primary text-glow mb-2">
                {selectedProject.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {selectedProject.description}
              </p>
              <p className="text-sm text-muted-foreground mb-4">Artiste de l'album: {albumArtist}</p>
              {projectBeats.length > 0 && (
                <Button onClick={() => handlePlay(projectBeats, 0)} className="bg-gradient-fire text-primary-foreground">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Écouter l'album
                </Button>
              )}
            </div>
          </div>

          {/* Beats Grid for this Project */}
          {projectBeats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectBeats.map((beat, index) => (
                <motion.div
                  key={beat.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <BeatCard 
                    id={beat.id}
                    title={beat.title}
                    genre={beat.genre || 'N/A'}
                    
                    duration={beat.duration || 'N/A'}
                    price={beat.price ? beat.price.toFixed(2) : 'Écoute seule'}
                    tags={beat.tags || []}
                    imageSrc={beat.cover_image_url} // Already corrected
                    author={beat.author || 'Inconnu'}
                    likes={beat.likes || 0}
                    onPlay={() => handlePlay(projectBeats, index)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-8">Aucun beat trouvé pour ce projet.</p>
          )}
        </div>
      </div>
    );
  }

  // Project List View
  return (
    <div className="min-h-screen pt-16 relative">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-metal text-5xl md:text-6xl text-primary text-glow mb-4">
            Nos Projets
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos collections de beats et nos projets spéciaux.
          </p>
        </motion.div>

        {projectsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map(project => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="aspect-video rounded-lg shadow-lg overflow-hidden metal-border relative group">
                  <img 
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h2 className="font-metal text-2xl text-primary text-glow text-center">{project.title}</h2>
                  </div>
                </div>
                <p className="text-center text-muted-foreground mt-2">{project.description.substring(0, 100)}...</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-12">Aucun projet n'a été défini.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;

