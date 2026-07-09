import type { GameWindowProps } from '../GameWindow.types';

export interface GameWindowTitleBarProps {
  isFullView: boolean;
  isGhost: boolean;
  onRedClick: () => void;
  onYellowClick: () => void;
  onToggleFullView: () => void;
  toolbar: GameWindowProps['toolbar'];
}
