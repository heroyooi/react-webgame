import { Outlet } from 'react-router-dom';
import toastr from 'toastr';
import Header from '@/components/common/Header';
import { AuthContextProvider } from '@/contexts/AuthContext';
import styles from '@/assets/styles/common.module.scss';
import 'toastr/build/toastr.min.css';

toastr.options = {
  timeOut: 2000,
  positionClass: 'toast-bottom-center',
};

function App() {
  return (
    <AuthContextProvider>
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.container}>
          <Outlet />
        </div>
      </div>
    </AuthContextProvider>
  );
}

export default App;
