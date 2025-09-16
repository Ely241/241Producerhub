import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Download, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from '@/components/layout/ParticleBackground';
import AudioPlayer from '@/components/ui/audio-player';
import heroImage from '@/assets/hero-bg.jpg';

const Home = () => {
  // Sample beats for the home page
  const featuredBeats = [
    {
      title: "Dark Trap",
      src: "https://www.soundjay.com/misc/sounds/waterdrip.mp3", // placeholder
    },
    {
      title: "Metal Drill",
      src: "https://www.soundjay.com/misc/sounds/waterdrip.mp3", // placeholder
    },
    {
      title: "Fire Afrobeat",
      src: "https://www.soundjay.com/misc/sounds/waterdrip.mp3", // placeholder
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
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
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              JylsTheProducer
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              Beats sombres avec une âme de métal. Je crée des tracks de feu en Trap, Afrobeat et Drill avec cette esthétique rouge et noir signature.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/beats">
              <Button 
                size="lg" 
                className="bg-gradient-fire hover:scale-105 transition-transform glow-red text-lg px-8 py-3"
              >
                <Music className="w-5 h-5 mr-2" />
                Explorer les Beats
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all text-lg px-8 py-3"
              >
                <Download className="w-5 h-5 mr-2" />
                Beat Sur Mesure
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Beats Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-metal text-4xl md:text-5xl text-primary text-glow mb-4">
              Beats en Vedette
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvre le son signature de 241 PRODUCER. Sombre, lourd et inoubliable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredBeats.map((beat, index) => (
              <motion.div
                key={beat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AudioPlayer 
                  src={beat.src}
                  title={beat.title}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/beats">
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Voir Tous les Beats
              </Button>
            </Link>
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