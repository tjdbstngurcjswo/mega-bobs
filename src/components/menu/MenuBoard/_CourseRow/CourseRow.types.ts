import {MenuType} from '@/api/menu.types';
import {VoteResult, VoteType} from '@/api/vote.types';

export interface CourseRowProps {
  menu: MenuType;
  index?: number;
  showVote?: boolean;
  voteResult?: VoteResult;
  onVote?: (type: VoteType) => void;
  isSubmitting?: boolean;
  showPick?: boolean;
  pickCount?: number;
  isPicked?: boolean;
  onPick?: () => void;
  isSubmittingPick?: boolean;
}
