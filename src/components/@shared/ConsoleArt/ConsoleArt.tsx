'use client';

import { useEffect } from 'react';

import { CONSOLE_ART, CONSOLE_ART_STYLE } from './ConsoleArt.constants';

const ConsoleArt = () => {
  useEffect(() => {
    console.log(`%c${  CONSOLE_ART}`, CONSOLE_ART_STYLE);
  }, []);

  return null;
};

export default ConsoleArt;
