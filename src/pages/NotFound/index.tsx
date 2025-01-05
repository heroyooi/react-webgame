import Header from '@/components/common/Header';
import styles from '@/assets/styles/common.module.scss';

function NotFound() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <div>페이지가 존재하지 않습니다.</div>
      </div>
    </div>
  );
}

export default NotFound;
