import React, { memo } from 'react';
import { TryProps } from '@/types/try';

const Try: React.FunctionComponent<TryProps> = memo(({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
});

export default Try;
