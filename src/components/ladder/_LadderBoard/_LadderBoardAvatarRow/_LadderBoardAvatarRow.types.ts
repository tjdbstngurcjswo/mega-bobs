import type { LadderPhase } from '@/components/ladder/LadderGame.types';

export interface AvatarRowProps {
  names: string[];
  phase: LadderPhase;
  showTraces: boolean;
  revealedSet: Set<number>;
  onRemove: (i: number) => void;
  onParticipantClick?: (i: number) => void;
}
