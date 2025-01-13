import { FormEvent, useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import styles from './Login.module.scss';
import commonStyles from '@/assets/styles/common.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthType, SocialProvider } from '@/types/firebase';
import { FirebaseError } from 'firebase/app';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

toastr.options = {
  timeOut: 2000,
  positionClass: 'toast-bottom-center',
};

function Login() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { socialLogin, login, signup } = useAuthContext();
  const [authType, setAuthType] = useState<AuthType>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    if (id == undefined) {
      navigate('/login/social');
    }
  }, [id]);

  const handleTab = (path: string) => () => {
    navigate(path);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let user = null;
      let signedUser = null;
      if (authType === 'login') {
        user = await login(email, password);
        console.log('로그인 결과 : ', user);
      } else if (authType === 'signup') {
        signedUser = await signup(email, password);
        console.log('회원가입 결과 : ', signedUser);
      }
      if (user || signedUser) {
        navigate('/');
      }
    } catch (error) {
      const fbError = error as FirebaseError;
      console.log(fbError.code);
      if (fbError.code === 'auth/invalid-email') {
        toastr.error('유효하지 않은 이메일입니다.');
      } else if (fbError.code === 'auth/missing-password') {
        toastr.error('비밀번호가 틀렸습니다.');
      } else if (fbError.code === 'auth/invalid-credential') {
        toastr.error('존재하지 않는 회원 정보입니다.');
      } else if (fbError.code === 'auth/too-many-requests') {
        toastr.error(
          '이 계정에 대한 액세스가 일시적으로 비활성화되었으므로 암호를 설정하거나 나중에 다시 시도하십시오.'
        );
      }
    }
  };

  const handleSocialLogin = (provider: SocialProvider) => async (e) => {
    e.preventDefault();
    try {
      const user = await socialLogin(provider)();
      console.log('로그인 성공 : ', user);
      if (user) {
        navigate('/');
      }
    } catch (error) {
      console.error('로그인 실패 : ', error);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.page__auth}>
        <ul className={styles.page__auth__tab}>
          <li
            className={id == 'social' ? styles.on : null}
            onClick={handleTab('/login/social')}
          >
            Social 인증
          </li>
          <li
            className={id == 'general' ? styles.on : null}
            onClick={handleTab('/login/general')}
          >
            일반 인증
          </li>
        </ul>
        {id == 'social' && (
          <div className={styles.page__auth__social}>
            <div className={commonStyles.commonBtn}>
              <button onClick={handleSocialLogin('google')}>
                구글 로그인/회원가입
              </button>
              <button onClick={handleSocialLogin('github')}>
                깃헙 로그인/회원가입
              </button>
              <button onClick={handleSocialLogin('facebook')}>
                페이스북 로그인/회원가입
              </button>
            </div>
          </div>
        )}
        {id == 'general' && (
          <div className={styles.page__auth__general}>
            <div className={commonStyles.commonBtn}>
              <button onClick={() => setAuthType('login')}>로그인</button>
              <button onClick={() => setAuthType('signup')}>회원가입</button>
            </div>
            {authType == 'login' && (
              <div>
                <form onSubmit={handleSubmit}>
                  <input
                    type='email'
                    placeholder='이메일을 입력해주세요.'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type='password'
                    placeholder='비밀번호를 입력해주세요.'
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
                    type='email'
                    placeholder='이메일을 입력해주세요.'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type='password'
                    placeholder='비밀번호를 입력해주세요.'
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
    </div>
  );
}

export default Login;
