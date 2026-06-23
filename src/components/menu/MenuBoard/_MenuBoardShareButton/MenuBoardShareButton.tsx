'use client';

import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { buildDateUrl } from '@/utils/dateQuery';

import { shareButtonClass } from './MenuBoardShareButton.styles';
import { MenuBoardShareButtonProps } from './MenuBoardShareButton.types';

const MenuBoardShareButton = ({ date }: MenuBoardShareButtonProps) => {
  const handleShare = async () => {
    const url = buildDateUrl(window.location.href, { date });
    const shareData = {
      title: '메가존 구내식당 메뉴',
      text: `${date} 메뉴를 확인해보세요.`,
      url,
    };

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success('공유 링크를 복사했어요');
    } catch {
      toast.error('링크 복사에 실패했어요');
    }
  };

  return (
    <button
      type="button"
      aria-label={`${date} 메뉴 공유`}
      title="메뉴 공유"
      className={shareButtonClass}
      onClick={handleShare}
    >
      <Share2 size={17} strokeWidth={2.4} aria-hidden />
    </button>
  );
};

export default MenuBoardShareButton;
