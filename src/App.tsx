import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { WatercolorDefs } from './components/illustrations/WatercolorDefs';
import { Opening } from './components/Opening';
import { ChapterEight, ChapterFive, ChapterFour, ChapterOne, ChapterSix, ChapterThree, ChapterTwo } from './components/chapters/Story';
import { ChapterSeven } from './components/chapters/Rsvp';
import { MusicButton } from './components/MusicButton';
import { MusicProvider } from './hooks/useMusic';

export default function App() {
  const [ready, setReady] = useState(false);
  const onComplete = useCallback(() => setReady(true), []);
  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <WatercolorDefs />
        <div className="paper-grain" aria-hidden />
        <MusicButton visible={ready} />
        <main className="relative">
          <Opening onComplete={onComplete} />
          <ChapterOne />
          <ChapterTwo />
          <ChapterThree />
          <ChapterFour />
          <ChapterFive />
          <ChapterSix />
          <ChapterSeven />
          <ChapterEight />
        </main>
      </MusicProvider>
    </MotionConfig>
  );
}
