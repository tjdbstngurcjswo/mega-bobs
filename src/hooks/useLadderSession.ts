'use client';

import { useState } from 'react';

const DEFAULT_PARTICIPANTS = ['🐱', '🐶', '🐻', '🐼'];
export const DEFAULT_ITEMS = ['🎉 당첨', '꽝', '꽝', '꽝'];

export const useLadderSession = () => {
  const [participants, setParticipants] =
    useState<string[]>(DEFAULT_PARTICIPANTS);
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);

  return { participants, items, setParticipants, setItems };
};
