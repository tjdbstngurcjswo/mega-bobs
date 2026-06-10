export type LadderData = {
  n: number;
  rungRows: number;
  rungSet: Set<string>;
  results: number[];
};

const shuffle = <T>(arr: T[]): T[] =>
  arr.sort(() => Math.random() - 0.5);

export const buildLadder = (n: number): LadderData => {
  const rungRows = Math.min(n + 6, 12);
  const rungSet = new Set<string>();

  for (let row = 0; row < rungRows; row++) {
    const cols = shuffle(Array.from({ length: n - 1 }, (_, i) => i));
    for (const col of cols) {
      const lKey = `${row}:${col - 1}`;
      const rKey = `${row}:${col + 1}`;
      if (!rungSet.has(lKey) && !rungSet.has(rKey) && Math.random() < 0.45) {
        rungSet.add(`${row}:${col}`);
      }
    }
  }

  const results = Array.from({ length: n }, (_, p) => {
    let col = p;
    for (let row = 0; row < rungRows; row++) {
      const rKey = `${row}:${col}`;
      const lKey = col > 0 ? `${row}:${col - 1}` : '';
      if (rungSet.has(rKey)) col += 1;
      else if (lKey && rungSet.has(lKey)) col -= 1;
    }
    return col;
  });

  return { n, rungRows, rungSet, results };
};
