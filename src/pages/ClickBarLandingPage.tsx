import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import ParticleBackground from '../components/layout/ParticleBackground'; // Import ParticleBackground

interface ProgressData {
  current_clicks: number;
  target_clicks: number;
  is_completed: boolean;
}

interface ClickBarLandingPageProps {
  onCompletion: () => void;
}

const ClickBarLandingPage: React.FC<ClickBarLandingPageProps> = ({ onCompletion }) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/progress');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ProgressData = await response.json();
        setProgress(data);
        if (data.is_completed) {
          onCompletion();
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [onCompletion]);

  const handleClick = async () => {
    if (progress && progress.is_completed) return; // Prevent clicks if already completed

    try {
      const response = await fetch('/api/click', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ProgressData = await response.json();
      setProgress(data);
      if (data.is_completed) {
        onCompletion();
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-red-900 text-white">Error: {error}</div>;
  }

  const progressPercentage = progress ? (progress.current_clicks / progress.target_clicks) * 100 : 0;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white p-4"> {/* Added relative positioning */}
      <ParticleBackground /> {/* Add ParticleBackground here */}

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* SVG Text Progress Bar */}
        <svg width="100%" viewBox="0 0 800 200" className="mb-8">
          <defs>
            <linearGradient id="redFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 85%, 50%)" />
              <stop offset="100%" stopColor="hsl(0, 85%, 50%)" />
            </linearGradient>
            <linearGradient id="grayBase" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 0%, 12%)" />
              <stop offset="100%" stopColor="hsl(0, 0%, 12%)" />
            </linearGradient>

            {/* Define the text as a clipPath */}
            <clipPath id="textShapeClip">
              <text x="50%" y="70%" textAnchor="middle" style={{ fontSize: '100px', fontFamily: "'Metal Mania', cursive" }}>
                241 PRODUCER
              </text>
            </clipPath>

            {/* Liquid Effect Filter */}
            <filter id="liquidFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.01 0.06" numOctaves="3" result="noise">
                <animate attributeName="baseFrequency" from="0.01 0.06" to="0.06 0.01" dur="30s" repeatCount="indefinite" />
                <animate attributeName="seed" from="0" to="100" dur="60s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" />
            </filter>
          </defs>

          {/* Base text (gray) */}
          <text x="50%" y="70%" textAnchor="middle" fill="url(#grayBase)" style={{ fontSize: '100px', fontFamily: "'Metal Mania', cursive" }}>
            241 PRODUCER
          </text>

          {/* Red fill that will be clipped by the text shape */}
          <rect
            x="0"
            y={200 - (progressPercentage / 100) * 200} // Animate from bottom to top
            width="800"
            height={(progressPercentage / 100) * 200}
            fill="url(#redFill)"
            clipPath="url(#textShapeClip)" // Apply the text shape as a clip path
            filter="url(#liquidFilter)" // Apply the liquid filter
          />
        </svg>

        <p className="text-xl md:text-2xl mb-8 text-center text-primary-foreground drop-shadow-md font-metal">UNLEASH THE POWER OF SOUND. CLICK TO ACTIVATE.</p>

        <p className="text-lg text-center mt-2 text-primary-foreground drop-shadow-md font-metal">PROGRESS: {progress?.current_clicks} / {progress?.target_clicks}</p>


        <Button
          onClick={handleClick}
          disabled={progress?.is_completed}
          className="px-8 py-4 text-lg bg-gradient-fire hover:scale-105 transition-transform glow-red text-white font-semibold font-metal"
        >
          {progress?.is_completed ? 'LAUNCHED! ENTER THE VOID' : 'UNLEASH THE BEATS'}
        </Button>

        {/* Temporary Skip Button */}
        {!progress?.is_completed && ( // Only show if not yet launched
          <Button
            onClick={onCompletion} // Call onCompletion directly
            className="mt-4 px-8 py-4 text-lg bg-secondary hover:bg-secondary-foreground transition-transform text-white font-semibold font-metal"
          >
            BYPASS LAUNCH (DEV ONLY)
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClickBarLandingPage;