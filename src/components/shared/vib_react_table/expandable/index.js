import React from 'react';
import Table from './table';
import Styles from './styles';

const VibExpandableTable = ({ columns, tableData }) => (
  <Styles>
    <Table
      columns={columns}
      data={tableData}
      expandedRows
    />
  </Styles>
);

export default VibExpandableTable;
