'use client';

import { createContext, useContext } from 'react';

interface GameWindowContextValue {
  isFullView: boolean;
}

export const GameWindowContext = createContext<GameWindowContextValue>({
  isFullView: false,
});

export const useGameWindow = () => useContext(GameWindowContext);
