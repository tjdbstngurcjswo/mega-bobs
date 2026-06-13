'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { GameWindowTitleBar } from './_GameWindowTitleBar';
import type { GameWindowTitleBarProps } from './_GameWindowTitleBar/index';
import { GameWindowContext } from './GameWindow.context';
import { GAME_BG, frameClass } from './GameWindow.styles';
import type { GameWindowProps } from './GameWindow.types';

export const GameWindow = ({ children, toolbar }: GameWindowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullView, setIsFullView] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isGhost, setIsGhost] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullView(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleRedClick = () => {
    if (isWiggling) return;
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 400);
  };

  const toggleFullView = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const titleBarProps: GameWindowTitleBarProps = {
    isFullView,
    isGhost,
    onRedClick: handleRedClick,
    onYellowClick: () => setIsGhost((v) => !v),
    onToggleFullView: toggleFullView,
    toolbar,
  };

  return (
    <GameWindowContext.Provider value={{ isFullView }}>
      <motion.div
        ref={containerRef}
        className={frameClass(isFullView, isWiggling)}
        animate={{ opacity: isGhost ? 0.28 : 1 }}
        whileHover={isGhost ? { opacity: 1 } : undefined}
        transition={{ duration: 0.2 }}
      >
        <GameWindowTitleBar {...titleBarProps} />
        <div
          className={
            isFullView
              ? 'flex flex-1 flex-col overflow-hidden'
              : 'w-full overflow-hidden'
          }
          style={{ background: GAME_BG }}
        >
          {children}
        </div>
      </motion.div>
    </GameWindowContext.Provider>
  );
};
