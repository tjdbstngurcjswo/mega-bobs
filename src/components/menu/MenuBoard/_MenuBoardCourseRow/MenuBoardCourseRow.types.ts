import { MenuType } from '@/models/menu';
import { VoteResult, VoteType } from '@/models/vote';

interface VoteProps {
  show?: boolean;
  result?: VoteResult;
  onVote?: (type: VoteType) => void;
  isSubmitting?: boolean;
}

interface PickProps {
  show?: boolean;
  count?: number;
  isPicked?: boolean;
  onPick?: () => void;
  isSubmitting?: boolean;
}

export interface MenuBoardCourseRowProps {
  menu: MenuType;
  vote?: VoteProps;
  pick?: PickProps;
}
