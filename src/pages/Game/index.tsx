import { Link, useParams } from 'react-router-dom';
import {
  Gugudan,
  WordRelay,
  NumberBaseball,
  ResponseCheck,
  RSP,
  Lotto,
  Tictactoe,
  MineSearch,
} from '@/components/game';
import commonStyles from '@/assets/styles/common.module.scss';

function Game() {
  const { id } = useParams();

  function GameTitle(id) {
    switch (id) {
      case 'gugudan':
        return '구구단';
      case 'word-relay':
        return '끝말잇기';
      case 'number-baseball':
        return '숫자야구';
      case 'response-check':
        return '반응속도체크';
      case 'rsp':
        return '가위바위보';
      case 'lotto':
        return '로또';
      case 'tictactoe':
        return '틱택토';
      case 'mine-search':
        return '지뢰찾기';
      default:
        return '없는 게임';
    }
  }

  function GameMatcher(id) {
    if (id == 'gugudan') {
      return <Gugudan />;
    } else if (id === 'word-relay') {
      return <WordRelay />;
    } else if (id === 'number-baseball') {
      return <NumberBaseball />;
    } else if (id === 'response-check') {
      return <ResponseCheck />;
    } else if (id === 'rsp') {
      return <RSP />;
    } else if (id === 'lotto') {
      return <Lotto />;
    } else if (id === 'tictactoe') {
      return <Tictactoe />;
    } else if (id === 'mine-search') {
      return <MineSearch />;
    }
  }

  return (
    <div>
      <h2>{GameTitle(id)}</h2>
      {GameMatcher(id)}
      <div className={commonStyles.commonBtn}>
        <Link to='/'>메인으로 가기</Link>
      </div>
    </div>
  );
}

export default Game;
