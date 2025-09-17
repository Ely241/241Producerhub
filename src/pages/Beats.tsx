import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BeatCard from '@/components/ui/beat-card';
import ParticleBackground from '@/components/layout/ParticleBackground';
import { useQuery } from '@tanstack/react-query';
import type { Beat } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useAudio } from '@/context/use-audio'; // Import useAudio hook
import API_BASE_URL from '@/lib/api-client';

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const fetchBeats = async (query: string, genre: string, page: number, limit: number): Promise<{beats: Beat[], totalCount: number}> => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (genre) params.append('genre', genre);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  const requestUrl = `${API_BASE_URL}/api/beats?${params.toString()}`;
  console.log('Beats.tsx - Requête API beats:', requestUrl);
  const res = await fetch(requestUrl);
  console.log('Beats.tsx - Réponse API beats OK:', res.ok, 'Statut:', res.status);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json().then(data => {
    console.log(`Beats.tsx - Beats bruts de l'API:`, data.beats.map((b: Beat) => ({ id: b.id, title: b.title, cover_image_url: b.cover_image_url })));
    return data;
  });
};

const fetchGenres = async (): Promise<string[]> => {
    const res = await fetch(`${API_BASE_URL}/api/genres`);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  };

const Beats = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const limit = 6;
  const { playPlaylist } = useAudio(); // Get the playPlaylist function

  const { data, isLoading, isError, error } = useQuery<{beats: Beat[], totalCount: number}, Error>({
    queryKey: ['beats', debouncedSearchQuery, selectedGenre, page],
    queryFn: () => fetchBeats(debouncedSearchQuery, selectedGenre, page, limit),
  });

  const { data: genres } = useQuery<string[], Error>({
    queryKey: ['genres'],
    queryFn: fetchGenres,
  });

  const handlePlay = (startIndex: number) => {
    if (data?.beats) {
      const playlist = data.beats.map(beat => ({
        ...beat,
        audioSrc: `${API_BASE_URL}${beat.audio_file_url}`,
        imageSrc: beat.cover_image_url,
      }));
      playPlaylist(playlist, startIndex);
    }
  };

  const totalPages = data ? Math.ceil(data.totalCount / limit) : 0;

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
            Bibliothèque de Beats
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plonge dans le côté sombre du son. Beats premium créés avec une âme de métal et un feu urbain.
          </p>
        </motion.div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <Input 
                placeholder="Rechercher par nom, artiste..."
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
                className="bg-card/80 backdrop-blur-sm"
            />
            <Select onValueChange={(value) => {setSelectedGenre(value === "all" ? "" : value); setPage(1);}} value={selectedGenre}>
                <SelectTrigger className="w-full md:w-[180px] bg-card/80 backdrop-blur-sm">
                    <SelectValue placeholder="Filtrer par genre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les genres</SelectItem>
                    {genres?.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(limit)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-[205px] w-full" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                ))}
            </div>
        )}

        {isError && <p className="text-red-500 text-center">Erreur: {error?.message}</p>}

        {!isLoading && !isError && data && data.beats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {console.log('Beats.tsx - data.beats avant rendu:', data.beats)} {/* Ajout du log */}
            {data.beats.map((beat, index) => (
                <motion.div
                key={beat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                {console.log(`Beats.tsx - Rendu du beat ${beat.title}, imageSrc: ${API_BASE_URL}${beat.cover_image_url}`)} {/* Ajout du log */}
                <BeatCard 
                    id={beat.id}
                    title={beat.title}
                    genre={beat.genre || 'N/A'}
                    bpm={beat.bpm || 0}
                    duration={beat.duration || 'N/A'}
                    price={beat.price ? beat.price.toFixed(2) : 'Écoute seule'}
                    tags={beat.tags || []}
                    imageSrc={beat.cover_image_url}
                    author={beat.author || 'Inconnu'}
                    likes={beat.likes || 0}
                    onPlay={() => handlePlay(index)} // Pass the handler to the card
                />
                </motion.div>
            ))}
            </div>
        )}

        {!isLoading && !isError && data?.beats.length === 0 && (
            <p className="text-center text-muted-foreground mt-12">Aucun beat ne correspond à votre recherche.</p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); setPage(p => Math.max(p - 1, 1));}} className={page <= 1 ? 'pointer-events-none opacity-50' : ''} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink href="#" isActive={page === i + 1} onClick={(e) => {e.preventDefault(); setPage(i + 1);}}>
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={(e) => {e.preventDefault(); setPage(p => Math.min(p + 1, totalPages));}} className={page >= totalPages ? 'pointer-events-none opacity-50' : ''} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        )}

      </div>
    </div>
  );
};

export default Beats;
