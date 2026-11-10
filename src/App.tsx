import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { WatercolorDefs } from './components/illustrations/WatercolorDefs';
import { Opening } from './components/Opening';
import {
  ChapterFive,
  ChapterFour,
  ChapterNine,
  ChapterOne,
  ChapterSeven,
  ChapterSix,
  ChapterThree,
  ChapterTwo,
} from './components/chapters/Story';
import { ChapterEight } from './components/chapters/Rsvp';
import { MusicButton } from './components/MusicButton';
import { MusicProvider } from './hooks/useMusic';

export default function App() {
  const [ready, setReady] = useState(false);
  const [openingKey, setOpeningKey] = useState(0);
  const onComplete = useCallback(() => setReady(true), []);

  /** Vuelve a reproducir la apertura completa (libro + cinta + globo). */
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
          <Opening key={openingKey} onComplete={onComplete} />
          <ChapterOne />
          <ChapterTwo />
          <ChapterThree />
          <ChapterFour />
          <ChapterFive />
          <ChapterSix />
          <ChapterSeven />
          <ChapterEight />
          <ChapterNine onReplay={replay} />
        </main>
      </MusicProvider>
    </MotionConfig>
  );
}
