import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import AccountTableHeader from './AccountTableHeader';
import AccountTableBody from './AccountTableBody';

const AccountTable = ({
  onSelectAllAccountsChange,
  isAllAccountsSelected,
  selectedAccountIds,
  accountsList,
  handleAccountSelectChange,
}) => (
  <Table responsive>
    <AccountTableHeader
      onSelectAllAccountsChange={onSelectAllAccountsChange}
      isAllAccountsSelected={isAllAccountsSelected}
    />

    <AccountTableBody
      selectedAccountIds={selectedAccountIds}
      accountsList={accountsList}
      handleAccountSelectChange={handleAccountSelectChange}
      isAllAccountsSelected={isAllAccountsSelected}
    />
  </Table>
);

AccountTable.propTypes = {
  onSelectAllAccountsChange: PropTypes.func.isRequired,
  isAllAccountsSelected: PropTypes.bool.isRequired,
  selectedAccountIds: PropTypes.instanceOf(Array).isRequired,
  accountsList: PropTypes.instanceOf(Array).isRequired,
  handleAccountSelectChange: PropTypes.func.isRequired,
};

export default AccountTable;
