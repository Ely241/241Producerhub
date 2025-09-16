import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "./context/AudioContext";
import Home from "./pages/Home";
import Beats from "./pages/Beats";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AudioPlayerContainer from './components/layout/AudioPlayerContainer';

const queryClient = new QueryClient();

const App = () => (
  <>
    <div className="relative z-10">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AudioProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/beats" element={<Beats />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/projects/:projectId?" element={<Projects />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
              <AudioPlayerContainer />
            </AudioProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  </>
);

export default App;