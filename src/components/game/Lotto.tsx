import { useState, useRef, useEffect, useCallback } from 'react';
import Ball from './Ball';
import styles from '@/components/game/Lotto.module.scss';

function getWinNumbers() {
  console.log('getWinNumbers');
  const candidate = Array(45)
    .fill(null)
    .map((_, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(
      candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]
    );
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

function Lotto() {
  const [winNumbers, setWinNumbers] = useState(() => getWinNumbers());
  const [winBalls, setWinBalls] = useState<number[]>([]);
  const [bonus, setBonus] = useState<number | null>(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = window.setTimeout(() => {
        setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]);
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = window.setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);
    return () => {
      timeouts.current.forEach((v) => {
        clearTimeout(v);
      });
    };
  }, [timeouts.current]);

  useEffect(() => {
    console.log('로또 숫자를 생성합니다.');
  }, [winNumbers]);

  const onClickRedo = useCallback(() => {
    console.log('onClickRedo');
    console.log(winNumbers);
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  }, [winNumbers]);

  return (
    <div className={styles.lotto}>
      <div>당첨 숫자</div>
      <div id="결과창">
        {winBalls.map((v) => (
          <Ball key={v} number={v} />
        ))}
      </div>
      <div>보너스!</div>
      {bonus && <Ball number={bonus} />}
      {redo && <button onClick={onClickRedo}>한 번 더!</button>}
    </div>
  );
}

export { Lotto };
