import { memo } from 'react';
import styles from './Lotto.module.scss';

type Props = {
  number: number;
};

const Ball = memo(({ number }: Props) => {
  let background;
  if (number <= 10) {
    background = 'red';
  } else if (number <= 20) {
    background = 'orange';
  } else if (number <= 30) {
    background = 'yellow';
  } else if (number <= 40) {
    background = 'blue';
  } else {
    background = 'green';
  }

  return (
    <div className={styles.lotto__ball} style={{ background }}>
      {number}
    </div>
  );
});

export default Ball;
