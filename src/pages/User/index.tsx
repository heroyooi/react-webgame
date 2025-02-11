import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getUser } from '@/apis/firebase';
import styles from '@/pages/Profile/Profile.module.scss';
import Loading from '@/components/ui/Loading';
import { useQuery } from '@tanstack/react-query';

function User() {
  const { uid } = useParams<{ uid: string }>();
  // const [user, setUser] = useState<any>(null);

  // const [loading, setLoading] = useState(false);

  const { data: user, isLoading } = useQuery<any>({
    queryKey: ['user'],
    queryFn: getUser(uid),
    // staleTime: 300 * 1000,
  });

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     setLoading(true);
  //     try {
  //       const isUser = await getUser(uid);
  //       setUser(isUser);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, [uid]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.page__profile}>
        <ul className={styles.page__profile__info}>
          <li>
            <span className={styles.label}>이메일</span>
            <span className={styles.value}>{user?.email}</span>
          </li>
          <li>
            <span className={styles.label}>닉네임</span>
            <span className={styles.value}>
              {user?.displayName ?? '방문자'}
            </span>
          </li>
          <li>
            <span className={styles.label}>생성일</span>
            <span className={styles.value}>
              {dayjs(user?.createdAt).format('YYYY년 MM월 DD일 A HH시 mm분')}
            </span>
          </li>
          <li>
            <span className={styles.label}>마지막 접속일</span>
            <span className={styles.value}>
              {dayjs(user?.lastLogin).format('YYYY년 MM월 DD일 A HH시 mm분')}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default User;
