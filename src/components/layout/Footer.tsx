import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-12 py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex justify-center space-x-4 mb-4">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors text-sm">
            Politique de Confidentialité
          </Link>
        </div>
        <p className="text-sm">
          &copy; {currentYear} 241 PRODUCER. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
