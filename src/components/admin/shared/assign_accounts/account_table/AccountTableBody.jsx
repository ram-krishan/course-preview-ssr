import React from 'react';
import { includes } from 'lodash';
import PropTypes from 'prop-types';
import AccountTableRow from './AccountTableRow';

const AccountTableBody = ({
  selectedAccountIds,
  accountsList,
  handleAccountSelectChange,
}) => (
  <tbody>
    {accountsList.map(account => (
      <AccountTableRow
        key={`add-account-${account.id}`}
        account={account}
        handleAccountSelectChange={event => handleAccountSelectChange(event, account.id)}
        isSelected={includes(selectedAccountIds, account.id)}
      />
    ))}
  </tbody>
);

AccountTableBody.propTypes = {
  selectedAccountIds: PropTypes.instanceOf(Array).isRequired,
  accountsList: PropTypes.instanceOf(Array).isRequired,
  handleAccountSelectChange: PropTypes.func.isRequired,
};

export default AccountTableBody;
