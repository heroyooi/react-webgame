import { Link } from 'react-router-dom';
import commonStyles from '@/assets/styles/common.module.scss';
import styles from '@/pages/Main/Main.module.scss';
import { useAuthContext } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

function Main() {
  const { user, socialLogin, login, logout, signup } = useAuthContext();

  const [tab, setTab] = useState(1);
  const [authType, setAuthType] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleTab = (number) => () => {
    if (number == 1) {
      setAuthType('');
    }
    setTab(number);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authType === 'login') {
      login(email, password);
    } else if (authType === 'signup') {
      signup(email, password);
    }
  };

  return (
    <div className={styles.page}>
      <p className={styles.page__message}>
        해당 서비스는 리액트 교육 목적으로 제작 되었습니다.
      </p>
      {user ? (
        <>
          <div>
            <button onClick={logout}>로그아웃</button>
          </div>
          <ul className={styles.page__list}>
            <li>
              <Link to="/game/gugudan">- 구구단</Link>
            </li>
            <li>
              <Link to="/game/word-relay">- 끝말잇기</Link>
            </li>
            <li>
              <Link to="/game/number-baseball">- 숫자야구</Link>
            </li>
            <li>
              <Link to="/game/response-check">- 반응속도체크</Link>
            </li>
            <li>
              <Link to="/game/rsp">- 가위바위보</Link>
            </li>
            <li>
              <Link to="/game/lotto">- 로또</Link>
            </li>
            <li>
              <Link to="/game/tictactoe">- 틱택토</Link>
            </li>
            <li>
              <Link to="/game/mine-search">- 지뢰찾기</Link>
            </li>
          </ul>
        </>
      ) : (
        <>
          <div className={styles.page__auth}>
            <ul className={styles.page__auth__tab}>
              <li
                className={tab == 1 ? styles.on : null}
                onClick={handleTab(1)}
              >
                Social 인증
              </li>
              <li
                className={tab == 2 ? styles.on : null}
                onClick={handleTab(2)}
              >
                일반 인증
              </li>
            </ul>
            {tab == 1 && (
              <div className={styles.page__auth__social}>
                <div className={commonStyles.commonBtn}>
                  <button onClick={socialLogin('google')}>
                    구글 로그인/회원가입
                  </button>
                  <button onClick={socialLogin('github')}>
                    깃헙 로그인/회원가입
                  </button>
                  <button onClick={socialLogin('facebook')}>
                    페이스북 로그인/회원가입
                  </button>
                </div>
              </div>
            )}
            {tab == 2 && (
              <div className={styles.page__auth__general}>
                {authType == '' && (
                  <div className={commonStyles.commonBtn}>
                    <button onClick={() => setAuthType('login')}>로그인</button>
                    <button onClick={() => setAuthType('signup')}>
                      회원가입
                    </button>
                  </div>
                )}
                {authType == 'login' && (
                  <div>
                    <form onSubmit={handleSubmit}>
                      <input
                        type="email"
                        placeholder="이메일을 입력해주세요."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button>일반 로그인</button>
                    </form>
                  </div>
                )}
                {authType == 'signup' && (
                  <div>
                    <form onSubmit={handleSubmit}>
                      <input
                        type="email"
                        placeholder="이메일을 입력해주세요."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button>일반 회원가입</button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Main;
