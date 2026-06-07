import { MenuType } from '@/models/menu';
import { VoteResult, VoteType } from '@/models/vote';

export interface VoteProps {
  show?: boolean;
  result?: VoteResult;
  onVote?: (type: VoteType) => void;
  isSubmitting?: boolean;
}

export interface PickProps {
  show?: boolean;
  count?: number;
  isPicked?: boolean;
  onPick?: () => void;
  isSubmitting?: boolean;
}

export interface CourseRowProps {
  menu: MenuType;
  index?: number;
  vote?: VoteProps;
  pick?: PickProps;
}
