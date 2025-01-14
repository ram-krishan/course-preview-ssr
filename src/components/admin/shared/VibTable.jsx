import React from 'react';
import { useTable, useSortBy } from 'react-table';
import BTable from 'react-bootstrap/Table';
import ArrowDropDownIcon from '@material-ui/icons//ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import { SortIcon } from '../../../components/shared/vib_images';
import './style.scss';

const VibTable = ({ columns: userColumns, data, extraClassName }) => {
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useSortBy,
  );

  return (
    <>
      <BTable
        striped
        hover
        size="sm" {...getTableProps()}
        className={`react-table-common ${extraClassName}`}
      >
        <thead className="test">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps({ title: undefined }))}>
                  {column.render('Header')}
                  {!column.isSorted && column.canSort ? <img className="sort-icon" src={SortIcon} alt="sort-icon" /> : ''}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <ArrowDropDownIcon />
                        : <ArrowDropUp />
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>
            );
          })}
        </tbody>
      </BTable>
    </>
  );
};

export default VibTable;
