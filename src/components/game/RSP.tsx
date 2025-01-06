import { useState, useRef, useEffect } from 'react';
import styles from '@/components/game/RSP.module.scss';

const rspCoords = {
  바위: '0',
  가위: '-142px',
  보: '-284px',
};

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
};

const computerChoice = (imgCoords) => {
  return Object.keys(rspCoords).find((k) => {
    return rspCoords[k] === imgCoords;
  })!;
};

function RSP() {
  const [result, setResult] = useState('');
  const [imgCoord, setImgCoord] = useState(rspCoords.바위);
  const [score, setScore] = useState(0);
  const interval = useRef<number>();
  const clicked = useRef<boolean>(false);

  useEffect(() => {
    console.log('다시 실행');
    interval.current = window.setInterval(changeHand, 100);
    // RSP.tsx가 node에서 실행되는지 window에서 실행되는지 구별을 못하기 때문에 명시적으로 window를 붙여줘야한다.
    // window면 브라우저를 의미하고, 브라우저에서 실행되는 것을 확신을 시켜주는 것이다.
    return () => {
      console.log('종료');
      clearInterval(interval.current);
    };
  }, [imgCoord]);

  const changeHand = () => {
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위);
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보);
    } else if (imgCoord === rspCoords.보) {
      setImgCoord(rspCoords.바위);
    }
  };

  const onClickBtn = (choice) => () => {
    if (!clicked.current) {
      clearInterval(interval.current);
      clicked.current = true;
      const myScore = scores[choice];
      const cpuScore = scores[computerChoice(imgCoord)];
      const diff = myScore - cpuScore;
      if (diff === 0) {
        setResult('비겼습니다!');
      } else if ([-1, 2].includes(diff)) {
        setResult('이겼습니다!');
        setScore((prevScore) => prevScore + 1);
      } else {
        setResult('졌습니다!');
        setScore((prevScore) => prevScore - 1);
      }
      setTimeout(() => {
        interval.current = window.setInterval(changeHand, 100);
        clicked.current = false;
      }, 1000);
    }
  };

  return (
    <div className={styles.rsp}>
      <div
        className={styles.computer}
        style={{
          background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`,
        }}
      />
      <div>
        <button id="rock" className="btn" onClick={onClickBtn('바위')}>
          바위
        </button>
        <button id="scissor" className="btn" onClick={onClickBtn('가위')}>
          가위
        </button>
        <button id="paper" className="btn" onClick={onClickBtn('보')}>
          보
        </button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </div>
  );
}

export { RSP };
