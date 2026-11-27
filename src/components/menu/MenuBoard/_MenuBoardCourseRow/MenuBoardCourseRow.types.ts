import { EggStep } from '@/hooks/useEasterEgg';
import { MenuType } from '@/models/menu';

interface PickProps {
  show?: boolean;
  count?: number;
  isPicked?: boolean;
  hasAnyPick?: boolean;
  onPick?: () => void;
  isSubmitting?: boolean;
}

export interface MenuBoardCourseRowProps {
  menu: MenuType;
  pick?: PickProps;
  onHeaderClick?: () => void;
  eggStep?: EggStep;
}
