interface BoardEmptyProps {
  variant: 'closed' | 'comingUp';
}

const COPY = {
  closed: {
    label: 'CLOSED',
    title: '오늘은 구내식당이 쉬는 날이에요',
    body: '그래도 점심은 먹어야죠 — 주변 맛집은 어때요?',
  },
  comingUp: {
    label: 'COMING UP',
    title: '다음 주 메뉴는 목요일에 공개돼요',
    body: '영양사 선생님이 메뉴를 짜는 중이에요. 목요일에 다시 확인해 주세요',
  },
} as const;

const BoardEmpty = ({variant}: BoardEmptyProps) => {
  const copy = COPY[variant];

  return (
    <div className="px-6 py-12 text-center">
      <div className="text-accent-text text-[13px] font-black tracking-[0.3em]">
        {copy.label}
      </div>
      <h3 className="mt-3 text-[17px] font-extrabold">{copy.title}</h3>
      <p className="text-muted mt-1.5 text-[13.5px] leading-relaxed">
        {copy.body}
      </p>
    </div>
  );
};

export default BoardEmpty;
