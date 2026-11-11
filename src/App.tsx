import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { WatercolorDefs } from './components/illustrations/WatercolorDefs';
import { Opening } from './components/Opening';
import { Letter } from './components/letter/Letter';
import { RevealScene } from './components/letter/RevealScene';
import { ClosingSection, DateSection, DressCodeSection, GiftsSection, VenueSection } from './components/chapters/Story';
import { QuestionsSection, RsvpSection } from './components/chapters/Rsvp';
import { MusicButton } from './components/MusicButton';
import { MusicProvider } from './hooks/useMusic';

export default function App() {
  const [ready, setReady] = useState(false);
  const [openingKey, setOpeningKey] = useState(0);
  const onComplete = useCallback(() => setReady(true), []);

  /** Vuelve a reproducir la apertura completa (globo, sobre y carta). */
  const replay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setReady(false);
    setOpeningKey((k) => k + 1);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <WatercolorDefs />
        <div className="paper-grain" aria-hidden />
        <MusicButton visible={ready} onReplay={replay} />
        <main className="story relative">
          {/* 1 · Apertura: el globo, el sobre y la carta que se despliega */}
          <Opening key={openingKey} onComplete={onComplete} />
          {/* 2 · La carta continúa */}
          <Letter />
          {/* 3 · La carta se levanta y aparece el motivo de la celebración */}
          <RevealScene />
          {/* 4 · Los detalles, dentro del mismo universo ilustrado */}
          <DateSection />
          <VenueSection />
          <DressCodeSection />
          <GiftsSection />
          <RsvpSection />
          <QuestionsSection />
          <ClosingSection onReplay={replay} />
        </main>
      </MusicProvider>
    </MotionConfig>
  );
}
