import { useAuthContext } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from '@/components/common/Header.module.scss';
import commonStyles from '@/assets/styles/common.module.scss';

export default function Header() {
  const { user, logout } = useAuthContext();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <header className={styles.header}>
      <span></span>
      <h1>
        <Link to="/">Vite + React.js로 웹게임 만들기</Link>
      </h1>
      <div className={cx(styles.header__utilmenu, commonStyles.commonBtn)}>
        {user ? (
          <button onClick={logout}>로그아웃</button>
        ) : (
          <Link to="/login">회원가입/로그인</Link>
        )}
      </div>
    </header>
  );
}
