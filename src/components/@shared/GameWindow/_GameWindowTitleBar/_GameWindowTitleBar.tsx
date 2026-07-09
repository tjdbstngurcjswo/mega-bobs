'use client';

import { Maximize2, Minimize2 } from 'lucide-react';

import {
  titleBarStyle,
  trafficBtnClass,
  viewToggleBtnClass,
} from './_GameWindowTitleBar.styles';
import type { GameWindowTitleBarProps } from './_GameWindowTitleBar.types';

export const GameWindowTitleBar = ({
  isFullView,
  isGhost,
  onRedClick,
  onYellowClick,
  onToggleFullView,
  toolbar,
}: GameWindowTitleBarProps) => (
  <div className="flex items-center gap-3 px-3 py-2" style={titleBarStyle}>
    <div className="group flex items-center gap-1.5">
      <button
        type="button"
        onClick={onRedClick}
        className={trafficBtnClass}
        style={{ background: '#ff5f57' }}
        aria-label="흔들기"
      >
        <span
          className="invisible text-[8px] leading-none font-black group-hover:visible"
          style={{ color: '#7a1f1d' }}
        >
          ×
        </span>
      </button>
      <button
        type="button"
        onClick={onYellowClick}
        className={trafficBtnClass}
        style={{ background: '#febc2e' }}
        aria-label={isGhost ? '선명하게' : '흐리게'}
      >
        <span
          className="invisible text-[8px] leading-none font-black group-hover:visible"
          style={{ color: '#7a5400' }}
        >
          −
        </span>
      </button>
      <button
        type="button"
        onClick={onToggleFullView}
        className={trafficBtnClass}
        style={{ background: '#28c840' }}
        aria-label={isFullView ? '게임 화면 닫기' : '전체 화면으로 보기'}
      >
        <span
          className="invisible group-hover:visible"
          style={{ color: '#0c5a1a' }}
        >
          {isFullView ? <Minimize2 size={7} /> : <Maximize2 size={7} />}
        </span>
      </button>
    </div>
    <div className="flex-1" />
    <div className="flex items-center gap-1">
      {toolbar}
      <button
        type="button"
        onClick={onToggleFullView}
        className={viewToggleBtnClass}
        aria-label={isFullView ? '게임 화면 닫기' : '전체 화면으로 보기'}
      >
        {isFullView ? (
          <>
            <Minimize2 size={10} />
            닫기
          </>
        ) : (
          <>
            <Maximize2 size={10} />
            전체보기
          </>
        )}
      </button>
    </div>
  </div>
);
