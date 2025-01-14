import { useParams } from 'react-router-dom';

function User() {
  const { uid } = useParams<{ uid: string }>();
  return <div>유저 정보 페이지 {uid}</div>;
}

export default User;
