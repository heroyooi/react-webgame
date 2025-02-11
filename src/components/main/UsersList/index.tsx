import { getUsers } from '@/apis/firebase';
import Loading from '@/components/ui/Loading';
import styles from '@/pages/Main/Main.module.scss';
import { IUser } from '@/types/firebase';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default function UsersList() {
  // const [users, setUsers] = useState<IUser[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);

  const { data: users, isLoading } = useQuery<IUser[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 300 * 1000,
  });

  // useEffect(() => {
  //   const loadUsers = async () => {
  //     try {
  //       const fetchedUsers = await getUsers();
  //       setUsers(fetchedUsers);
  //     } catch (error) {
  //       console.error('유저 데이터를 가져오는 중 오류 발생:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadUsers();
  // }, []);

  if (isLoading) {
    return <Loading fixed={false} />;
  }

  return (
    <>
      <ul className={styles.page__list}>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/user/${user.id}`}>
              {user.email} ({user.displayName || '닉네임 없음'})
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
