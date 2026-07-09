import type {
  LadderPhase,
  RevealState,
} from '@/components/ladder/LadderGame.types';
import type { LadderData } from '@/utils/ladder';

export interface LadderBoardProps {
  participants: string[];
  items: string[];
  data: LadderData | null;
  phase: LadderPhase;
  reveal: RevealState;
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  onParticipantClick?: (i: number) => void;
}
