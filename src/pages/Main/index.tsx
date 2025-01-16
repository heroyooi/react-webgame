import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import styles from '@/pages/Main/Main.module.scss';
import UsersList from '@/components/main/UsersList';

function Main() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading]);

  return (
    <div className={styles.page}>
      <p className={styles.page__message}>
        해당 서비스는 리액트 교육 목적으로 제작 되었습니다.
      </p>

      <h3 className={styles.page__title}>게임 목록</h3>
      <ul className={styles.page__list}>
        <li>
          <Link to='/game/gugudan'>- 구구단</Link>
        </li>
        <li>
          <Link to='/game/word-relay'>- 끝말잇기</Link>
        </li>
        <li>
          <Link to='/game/number-baseball'>- 숫자야구</Link>
        </li>
        <li>
          <Link to='/game/response-check'>- 반응속도체크</Link>
        </li>
        <li>
          <Link to='/game/rsp'>- 가위바위보</Link>
        </li>
        <li>
          <Link to='/game/lotto'>- 로또</Link>
        </li>
        <li>
          <Link to='/game/tictactoe'>- 틱택토</Link>
        </li>
        <li>
          <Link to='/game/mine-search'>- 지뢰찾기</Link>
        </li>
      </ul>
      <h3 className={styles.page__title}>회원 목록</h3>
      <UsersList />
    </div>
  );
}

export default Main;
