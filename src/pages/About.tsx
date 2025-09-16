import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Headphones, Mic, Award, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from '@/components/layout/ParticleBackground';
import { beats } from '@/data/beats';
import { artists } from '@/data/artists';

const About = () => {
  const influences = [
    "Metro Boomin", "Southside", "808 Mafia", "Murda Beatz", 
    "Pierre Bourne", "Wheezy", "Nick Mira", "Internet Money"
  ];

  return (
    <div className="min-h-screen pt-16 relative">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-metal text-5xl md:text-6xl text-primary text-glow mb-4">
            À Propos de 241 PRODUCER
          </h1>
          <p className="text-xl text-muted-foreground">
            JYLSTHEPRODUCER • Le Côté Sombre du Son
          </p>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="font-metal text-3xl text-primary mb-6">Le Parcours</h2>
              <div className="space-y-4 text-foreground/90 leading-relaxed">
                <p>ASAP.....</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        
        {/* Services */}
        
        {/* Influences */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="font-metal text-3xl text-primary text-glow text-center mb-8">
                Influences Musicales
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {influences.map((influence, index) => (
                  <motion.div
                    key={influence}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <span className="inline-block bg-muted text-foreground px-4 py-2 rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                      {influence}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-dark border-border">
            <CardContent className="p-12">
              <h2 className="font-metal text-3xl text-primary text-glow mb-6">
                Prêt à Créer Quelque Chose de Sombre et Puissant ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Collaborons et donnons vie à ta vision avec ce son signature de 241 PRODUCER.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/beats">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Explorer les Beats
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    className="bg-gradient-fire hover:scale-105 transition-transform glow-red"
                  >
                    Travailler Avec Moi
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;