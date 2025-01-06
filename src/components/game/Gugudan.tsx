import { useRef, useState } from 'react';
import styles from '@/components/game/Gugudan.module.scss';

function rndNumber(number: number): number {
  return Math.ceil(Math.random() * number);
}

function Gugudan() {
  const [first, setFirst] = useState<number>(() => rndNumber(9));
  const [second, setSecond] = useState<number>(() => rndNumber(9));
  const [value, setValue] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (parseInt(value) === first * second) {
      setResult('정답');
      setFirst(rndNumber(9));
      setSecond(rndNumber(9));
      setValue('');
      input.focus();
    } else {
      setResult('땡');
      setValue('');
      input.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.gugudan}>
      <div className={styles.gugudan__question}>
        {first} 곱하기 {second}는?
      </div>
      <form className={styles.gugudan__form} onSubmit={handleSubmit}>
        <input
          className={styles.gugudan__form__input}
          type="number"
          value={value}
          placeholder="정답을 입력하세요."
          onChange={handleChange}
          ref={inputRef}
        />
        <button className={styles.gugudan__form__button}>입력</button>
      </form>
      <div className={styles.gugudan__result}>{result}</div>
    </div>
  );
}

export { Gugudan };
