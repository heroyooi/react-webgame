import { Dispatch, FunctionComponent, useMemo } from 'react';
import Tr from './Tr';

interface Props {
  tableData: string[][];
  dispatch: Dispatch<any>;
  onClick: () => void;
}
const Table: FunctionComponent<Props> = ({ tableData, dispatch }) => {
  return (
    <table>
      <tbody>
        {Array(tableData.length)
          .fill(null)
          .map((tr, i) =>
            useMemo(
              () => (
                <Tr
                  key={i}
                  dispatch={dispatch}
                  rowIndex={i}
                  rowData={tableData[i]}
                />
              ),
              [tableData[i]]
            )
          )}
      </tbody>
    </table>
  );
};

export default Table;
