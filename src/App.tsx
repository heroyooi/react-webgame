import { Outlet } from 'react-router-dom';
import Header from '@/components/common/Header';
import styles from '@/assets/styles/common.module.scss';

function App() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
