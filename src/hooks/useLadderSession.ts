'use client';

import { useEffect, useState } from 'react';

const KEY = 'megabobs-ladder-session';

export const DEFAULT_PARTICIPANTS = ['🐱', '🐶', '🐻', '🐼'];
export const DEFAULT_ITEMS = ['A코스', 'B코스', '테이크아웃', '패스'];

type Session = { participants: string[]; items: string[] };

const load = (): Session => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { participants: DEFAULT_PARTICIPANTS, items: DEFAULT_ITEMS };
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.participants.length && !parsed.items.length) {
      return { participants: DEFAULT_PARTICIPANTS, items: DEFAULT_ITEMS };
    }
    return parsed;
  } catch {
    return { participants: DEFAULT_PARTICIPANTS, items: DEFAULT_ITEMS };
  }
};

const save = (s: Session) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
};

export const useLadderSession = () => {
  const [participants, setP] = useState<string[]>(DEFAULT_PARTICIPANTS);
  const [items, setI] = useState<string[]>(DEFAULT_ITEMS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = load();
    setP(s.participants);
    setI(s.items);
    setLoaded(true);
  }, []);

  const setParticipants = (next: string[]) => {
    setP(next);
    save({ participants: next, items });
  };

  const setItems = (next: string[]) => {
    setI(next);
    save({ participants, items: next });
  };

  return { participants, items, setParticipants, setItems, loaded };
};
