import { memo, FunctionComponent } from 'react';
import { TryProps } from '@/types/NumberBaseball';

const Try: FunctionComponent<TryProps> = memo(({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
});

export default Try;
