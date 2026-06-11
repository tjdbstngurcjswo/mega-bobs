import {
  fadeBottomClass,
  fadeTopClass,
  payLineBottomBorderClass,
  payLineFillClass,
  payLineTopBorderClass,
  reelBottomItemClass,
  reelContentClass,
  reelMiddleItemClass,
  reelTopItemClass,
  reelWindowClass,
  reelWrapClass,
} from './Reel.styles';
import type { ReelProps } from './Reel.types';

const Reel = ({ items, stopped, isWinner }: ReelProps) => (
  <div className={reelWrapClass}>
    <div className={reelWindowClass}>
      <div className={reelContentClass}>
        <div className={reelTopItemClass(stopped)}>{items[0]}</div>
        <div className={reelMiddleItemClass(stopped, isWinner)}>
          {items[1]}
        </div>
        <div className={reelBottomItemClass(stopped)}>{items[2]}</div>
      </div>
      <div className={payLineFillClass} />
      <div className={payLineTopBorderClass} />
      <div className={payLineBottomBorderClass} />
      <div className={fadeTopClass} />
      <div className={fadeBottomClass} />
    </div>
  </div>
);

export default Reel;
