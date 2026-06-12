'use client';

import { useEffect, useState } from 'react';

const KEY = 'megabobs-ladder-session';

const DEFAULT_PARTICIPANTS = ['🐱', '🐶', '🐻', '🐼'];
export const DEFAULT_ITEMS = ['🎉 당첨', '꽝', '꽝', '꽝'];

type Session = { participants: string[]; items: string[] };

const normalizeItems = (participants: string[], items: string[]): string[] => {
  const n = participants.length;
  if (items.length === n) return items;
  if (items.length > n) return items.slice(0, n);
  const filled = [...items];
  while (filled.length < n) filled.push(DEFAULT_ITEMS[filled.length] ?? '꽝');
  return filled;
};

const load = (): Session => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { participants: DEFAULT_PARTICIPANTS, items: DEFAULT_ITEMS };
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.participants?.length) {
      return { participants: DEFAULT_PARTICIPANTS, items: DEFAULT_ITEMS };
    }
    return {
      participants: parsed.participants,
      items: normalizeItems(parsed.participants, parsed.items ?? []),
    };
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
