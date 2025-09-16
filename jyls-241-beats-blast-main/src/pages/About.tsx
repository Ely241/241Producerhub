import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Headphones, Mic, Award, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from '@/components/layout/ParticleBackground';

const About = () => {
  const stats = [
    { icon: Music, label: "Beats Produits", value: "500+" },
    { icon: Users, label: "Artistes Collaborateurs", value: "50+" },
    { icon: Award, label: "Années d'Expérience", value: "5+" },
    { icon: Headphones, label: "Heures en Studio", value: "2000+" }
  ];

  const influences = [
    "Metro Boomin", "Southside", "808 Mafia", "Murda Beatz", 
    "Pierre Bourne", "Wheezy", "Nick Mira", "Internet Money"
  ];

  const services = [
    {
      icon: Music,
      title: "Production de Beats",
      description: "Beats personnalisés en Trap, Drill, Afrobeat et Hip-Hop avec cette esthétique sombre signature."
    },
    {
      icon: Mic,
      title: "Mixage & Mastering",
      description: "Services professionnels de mixage et mastering pour rendre tes tracks prêtes pour l'industrie."
    },
    {
      icon: Zap,
      title: "Collaborations",
      description: "Ouvert au travail avec des artistes, producteurs et labels pour de nouveaux projets excitants."
    }
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
            JylsTheProducer • Le Côté Sombre du Son
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
                <p>
                  Bienvenue dans le côté sombre du son. Je suis JylsTheProducer, connu dans la rue sous le nom de 
                  <span className="text-primary font-semibold"> 241 PRODUCER</span>. 
                  Mon voyage a commencé dans l&apos;ombre, créant des beats qui mélangent l&apos;énergie brute du métal 
                  avec le pouls urbain du hip-hop moderne.
                </p>
                <p>
                  Ayant grandi entouré par la culture métal et hip-hop, j&apos;ai développé une perspective unique 
                  sur la production musicale. Mon son signature combine des éléments lourds et distordus avec 
                  des techniques de production modernes et nettes - créant des beats qui frappent différemment.
                </p>
                <p>
                  Chaque beat que je produis porte cette esthétique rouge et noir signature - sombre, puissante, 
                  et sans compromis. Que ce soit un beat trap percutant, un afrobeat avec des nuances de métal, 
                  ou une track drill qui coupe profond, mon objectif est de créer de la musique 
                  qui bouge à la fois le corps et l&apos;âme.
                </p>
                <p>
                  Le nom "241" représente la dualité dans ma musique - l&apos;équilibre entre l&apos;obscurité 
                  et la lumière, l&apos;agression et la mélodie, la tradition et l&apos;innovation. C&apos;est ce contraste 
                  qui rend chaque track unique et inoubliable.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="font-metal text-2xl text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-metal text-4xl text-primary text-glow text-center mb-12">
            Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <service.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-metal text-xl text-primary mb-3">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

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