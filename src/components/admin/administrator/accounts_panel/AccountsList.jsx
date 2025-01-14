import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import VibTable from '../../shared/VibTable';

const AccountsList = ({
  accounts,
  handleRemoveAccountChange,
  currentAdminUserRole,
}) => {
  const checkBox = (account) => (
    <input
      type="checkbox"
      checked={account.checked || false}
      onChange={(event) => handleRemoveAccountChange(event, account.id)}
    />
  );

  const columnOptionsArray = [];

  if (currentAdminUserRole !== 'operations_member') {
    columnOptionsArray.push(
      {
        Header: <span />,
        accessor: 'id',
        disableSortBy: true,
        Cell: (props) => (
          checkBox(props.row.original)
        ),
      },
    );
  }

  columnOptionsArray.push(
    {
      Header: <span><FormattedMessage id="admin.userCollections.userTable.name" /></span>,
      accessor: 'name',
      disableSortBy: false,
      Cell: (props) => (
        <a href={`/admin/accounts/${props.row.original.id}`}>
          {props.value}
        </a>
      ),
    },
    {
      Header: <span><FormattedMessage id="admin.users.accountTable.status" /></span>,
      accessor: 'status',
      disableSortBy: false,
      Cell: (props) => (
        <span>
          {props.value}
        </span>
      ),
    },
  );

  const getColumnOptions = () => columnOptionsArray;

  return (
    <VibTable
      columns={getColumnOptions()}
      data={accounts}
    />
  );
};

AccountsList.propTypes = {
  accounts: PropTypes.instanceOf(Array).isRequired,
  handleRemoveAccountChange: PropTypes.func.isRequired,
};

export default AccountsList;
